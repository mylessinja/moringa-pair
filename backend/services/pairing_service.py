"""
Pairing generation logic.

Given a cohort and a target week, produces student pairs while trying to
avoid repeating a partner a student has already had within a recent
lookback window (default: last 4 weeks of pairings for that cohort).

If it's impossible to avoid every repeat (e.g. a small cohort that has
already cycled through most combinations), the algorithm falls back to
allowing the minimum number of repeats necessary, and flags exactly
which pairs are repeats in the result so the caller can decide what to
do with that information.
"""
import random
from datetime import timedelta

from models import db, Pairing, CohortMember, Notification, User, Cohort
from services.audit_service import log_action


DEFAULT_LOOKBACK_WEEKS = 4
MAX_ATTEMPTS = 200


class PairingError(Exception):
    pass


def _recent_partner_map(cohort_id, week_start, lookback_weeks):
    """Build {student_id: set(recent_partner_ids)} from pairing history."""
    cutoff = week_start - timedelta(weeks=lookback_weeks)
    recent = (
        Pairing.query.filter(
            Pairing.cohort_id == cohort_id,
            Pairing.week_start >= cutoff,
            Pairing.week_start < week_start,
        ).all()
    )

    partner_map = {}
    for p in recent:
        partner_map.setdefault(p.student_a_id, set()).add(p.student_b_id)
        partner_map.setdefault(p.student_b_id, set()).add(p.student_a_id)
    return partner_map


def _attempt_pairing(student_ids, recent_partners):
    """
    One randomized greedy attempt. Returns (pairs, unavoidable_repeats)
    where pairs is a list of (a, b) tuples, or None if this attempt
    got stuck with a student that has no valid candidate at all
    (should only happen if cohort size < 2).
    """
    pool = list(student_ids)
    random.shuffle(pool)
    pairs = []
    repeats = []

    while len(pool) > 1:
        student = pool.pop()
        avoided = [c for c in pool if c not in recent_partners.get(student, set())]
        candidates = avoided if avoided else pool  # fall back to anyone if forced

        if not candidates:
            return None

        partner = random.choice(candidates)
        pool.remove(partner)
        pairs.append((student, partner))
        if partner in recent_partners.get(student, set()):
            repeats.append((student, partner))

    # odd one out: attach to the last pair as a trio-by-reference is not
    # supported by the current schema (student_a/student_b only), so the
    # leftover student is reported as unpaired rather than silently dropped.
    leftover = pool[0] if pool else None
    return pairs, repeats, leftover


def generate_pairings(cohort_id, week_start, focus=None, lookback_weeks=DEFAULT_LOOKBACK_WEEKS, triggered_by=None):
    """
    Generates and persists pairings for a cohort's students for the given
    week. Raises PairingError on bad input. Returns a dict summary.
    """
    members = CohortMember.query.filter_by(
        cohort_id=cohort_id, member_role="student"
    ).all()
    student_ids = [m.user_id for m in members]

    if len(student_ids) < 2:
        raise PairingError("Cohort needs at least 2 students to generate pairings.")

    existing = Pairing.query.filter_by(cohort_id=cohort_id, week_start=week_start).first()
    if existing:
        raise PairingError(f"Pairings for {week_start.isoformat()} already exist for this cohort.")

    recent_partners = _recent_partner_map(cohort_id, week_start, lookback_weeks)

    best_result = None
    for _ in range(MAX_ATTEMPTS):
        result = _attempt_pairing(student_ids, recent_partners)
        if result is None:
            continue
        pairs, repeats, leftover = result
        if best_result is None or len(repeats) < len(best_result[1]):
            best_result = result
        if not repeats:
            break

    if best_result is None:
        raise PairingError("Could not generate pairings for this cohort.")

    pairs, repeats, leftover = best_result

    created = []
    for a, b in pairs:
        pairing = Pairing(
            cohort_id=cohort_id,
            week_start=week_start,
            student_a_id=a,
            student_b_id=b,
            focus=focus,
        )
        db.session.add(pairing)
        created.append(pairing)
        db.session.flush()

        for student_id, partner_id in ((a, b), (b, a)):
            db.session.add(Notification(
                recipient_id=student_id,
                title="New pairing assigned",
                message=(
                    f"You've been paired for the week of {week_start.isoformat()}"
                    + (f". Focus: {focus}" if focus else ".")
                ),
                notification_type="pairing",
            ))

    cohort = Cohort.query.get(cohort_id)
    log_action(
        triggered_by,
        "Published pairing",
        f"Generated {len(created)} pairing(s) for '{cohort.name if cohort else cohort_id}', "
        f"week of {week_start.isoformat()}",
    )

    db.session.commit()

    return {
        "pairings": [p.to_dict() for p in created],
        "repeat_count": len(repeats),
        "repeats": [{"student_a_id": a, "student_b_id": b} for a, b in repeats],
        "unpaired_student_id": leftover,
    }
