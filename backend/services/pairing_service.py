"""
Pairing generation: balanced lookback + optional AI refinement.
"""
import random
from datetime import timedelta

from models import db, Pairing, CohortMember, Notification, Cohort, User
from services.audit_service import log_action

DEFAULT_LOOKBACK_WEEKS = 4
MAX_ATTEMPTS = 200


class PairingError(Exception):
    pass


def _student_ids(cohort_id):
    members = CohortMember.query.filter_by(
        cohort_id=cohort_id, member_role="student"
    ).all()
    return [m.user_id for m in members]


def _mastery_map(cohort_id):
    rows = CohortMember.query.filter_by(
        cohort_id=cohort_id, member_role="student"
    ).all()
    return {m.user_id: (m.mastery if m.mastery is not None else 50) for m in rows}


def _name_map(ids):
    users = User.query.filter(User.id.in_(ids)).all() if ids else []
    return {u.id: u.name for u in users}


def _recent_partner_map(cohort_id, week_start, lookback_weeks):
    cutoff = week_start - timedelta(weeks=lookback_weeks)
    recent = Pairing.query.filter(
        Pairing.cohort_id == cohort_id,
        Pairing.week_start >= cutoff,
        Pairing.week_start < week_start,
    ).all()
    partner_map = {}
    for p in recent:
        partner_map.setdefault(p.student_a_id, set()).add(p.student_b_id)
        partner_map.setdefault(p.student_b_id, set()).add(p.student_a_id)
    return partner_map


def _attempt_pairing(student_ids, recent_partners):
    pool = list(student_ids)
    random.shuffle(pool)
    pairs = []
    repeats = []

    while len(pool) > 1:
        student = pool.pop()
        avoided = [c for c in pool if c not in recent_partners.get(student, set())]
        candidates = avoided if avoided else list(pool)
        if not candidates:
            return None
        partner = random.choice(candidates)
        pool.remove(partner)
        pairs.append((student, partner))
        if partner in recent_partners.get(student, set()):
            repeats.append((student, partner))

    leftover = pool[0] if pool else None
    return pairs, repeats, leftover


def _build_preview_payload(cohort_id, week_start, pairs, repeats, leftover, mode, focus=None):
    names = _name_map([i for ab in pairs for i in ab] + ([leftover] if leftover else []))
    repeat_set = {(min(a, b), max(a, b)) for a, b in repeats}
    pair_rows = []
    for a, b in pairs:
        key = (min(a, b), max(a, b))
        pair_rows.append(
            {
                "student_a_id": a,
                "student_b_id": b,
                "student_a": names.get(a),
                "student_b": names.get(b),
                "is_repeat": key in repeat_set,
                "rationale": None,
                "score": None,
            }
        )
    return {
        "cohort_id": cohort_id,
        "week_start": week_start.isoformat(),
        "mode": mode,
        "focus": focus,
        "pairs": pair_rows,
        "repeat_count": len(repeats),
        "repeats": [{"student_a_id": a, "student_b_id": b} for a, b in repeats],
        "unpaired_student_id": leftover,
        "unpaired_student": names.get(leftover) if leftover else None,
    }


def preview_pairings(
    cohort_id,
    week_start,
    focus=None,
    lookback_weeks=DEFAULT_LOOKBACK_WEEKS,
    mode="balanced",
):
    """Compute pairs without writing to DB."""
    student_ids = _student_ids(cohort_id)
    if len(student_ids) < 2:
        raise PairingError("Cohort needs at least 2 students to generate pairings.")

    recent_partners = _recent_partner_map(cohort_id, week_start, lookback_weeks)

    if mode == "random":
        pool = list(student_ids)
        random.shuffle(pool)
        pairs, leftover = [], None
        while len(pool) > 1:
            pairs.append((pool.pop(), pool.pop()))
        if pool:
            leftover = pool[0]
        return _build_preview_payload(
            cohort_id, week_start, pairs, [], leftover, "random", focus
        )

    best = None
    for _ in range(MAX_ATTEMPTS):
        result = _attempt_pairing(student_ids, recent_partners)
        if result is None:
            continue
        pairs, repeats, leftover = result
        if best is None or len(repeats) < len(best[1]):
            best = result
        if not repeats:
            break

    if best is None:
        raise PairingError("Could not generate pairings for this cohort.")

    pairs, repeats, leftover = best
    return _build_preview_payload(
        cohort_id, week_start, pairs, repeats, leftover, "balanced", focus
    )


def persist_pairs(cohort_id, week_start, pairs, focus=None, triggered_by=None):
    """
    pairs: list of dicts with student_a_id, student_b_id
    """
    existing = Pairing.query.filter_by(
        cohort_id=cohort_id, week_start=week_start
    ).first()
    if existing:
        raise PairingError(
            f"Pairings for {week_start.isoformat()} already exist for this cohort."
        )

    member_ids = set(_student_ids(cohort_id))
    seen = set()
    created = []

    for item in pairs:
        a = int(item["student_a_id"])
        b = int(item["student_b_id"])
        if a == b:
            raise PairingError("A student cannot be paired with themselves.")
        if a not in member_ids or b not in member_ids:
            raise PairingError(f"Students {a} and/or {b} are not in this cohort.")
        if a in seen or b in seen:
            raise PairingError("Each student may appear in only one pair.")
        seen.add(a)
        seen.add(b)

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

        for sid in (a, b):
            db.session.add(
                Notification(
                    recipient_id=sid,
                    title="New pairing assigned",
                    message=(
                        f"You've been paired for the week of {week_start.isoformat()}"
                        + (f". Focus: {focus}" if focus else ".")
                    ),
                    notification_type="pairing",
                )
            )

    cohort = Cohort.query.get(cohort_id)
    log_action(
        triggered_by,
        "Published pairing",
        f"Published {len(created)} pairing(s) for "
        f"'{cohort.name if cohort else cohort_id}', week of {week_start.isoformat()}",
    )
    db.session.commit()
    return {
        "pairings": [p.to_dict() for p in created],
        "total": len(created),
    }


def generate_pairings(
    cohort_id,
    week_start,
    focus=None,
    lookback_weeks=DEFAULT_LOOKBACK_WEEKS,
    triggered_by=None,
):
    """Legacy: preview balanced + persist in one step."""
    preview = preview_pairings(
        cohort_id, week_start, focus=focus, lookback_weeks=lookback_weeks, mode="balanced"
    )
    return persist_pairs(
        cohort_id,
        week_start,
        preview["pairs"],
        focus=focus,
        triggered_by=triggered_by,
    )
