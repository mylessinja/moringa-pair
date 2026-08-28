from functools import wraps

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from models import (
    db,
    User,
    MentorProfile,
    MentorExpertise,
    Cohort,
    CohortMember,
)

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") != "admin":
            # fallback: load user from DB
            user = User.query.get(int(get_jwt_identity()))
            if not user or user.role != "admin":
                return jsonify({"error": "admin access required"}), 403
        return fn(*args, **kwargs)

    return wrapper


@admin_bp.get("/students")
@admin_required
def list_students():
    q = (
        db.session.query(User, CohortMember, Cohort)
        .outerjoin(CohortMember, CohortMember.user_id == User.id)
        .outerjoin(Cohort, Cohort.id == CohortMember.cohort_id)
        .filter(User.role == "student")
        .filter(
            (CohortMember.member_role == "student") | (CohortMember.id.is_(None))
        )
    )

    search = (request.args.get("search") or "").strip().lower()
    rows = q.all()

    students = []
    seen = set()
    for user, membership, cohort in rows:
        if user.id in seen:
            continue
        seen.add(user.id)
        if search and search not in user.name.lower() and search not in user.email.lower():
            continue
        students.append(
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "cohort": cohort.name if cohort else None,
                "mastery": membership.mastery if membership else None,
                "lastActive": user.last_active_at.isoformat()
                if user.last_active_at
                else None,
                "status": user.status,
            }
        )

    return jsonify({"students": students, "total": len(students)}), 200


@admin_bp.get("/mentors")
@admin_required
def list_mentors():
    mentors = User.query.filter_by(role="mentor").all()
    search = (request.args.get("search") or "").strip().lower()
    result = []

    for m in mentors:
        if search and search not in m.name.lower() and search not in m.email.lower():
            continue

        profile = m.mentor_profile
        skills = [e.skill for e in m.expertise]
        cohort_names = [
            mem.cohort.name
            for mem in m.cohort_memberships
            if mem.member_role == "mentor" and mem.cohort
        ]

        result.append(
            {
                "id": m.id,
                "name": m.name,
                "email": m.email,
                "expertise": skills,
                "activeCohorts": ", ".join(cohort_names) if cohort_names else "Unassigned",
                "status": profile.status if profile else "pending",
                "bio": profile.bio if profile else None,
            }
        )

    return jsonify({"mentors": result, "total": len(result)}), 200


@admin_bp.patch("/mentors/<int:mentor_id>/status")
@admin_required
def update_mentor_status(mentor_id):
    data = request.get_json(silent=True) or {}
    new_status = (data.get("status") or "").strip().lower()
    if new_status not in ("pending", "approved", "suspended"):
        return jsonify({"error": "status must be pending, approved, or suspended"}), 400

    user = User.query.filter_by(id=mentor_id, role="mentor").first()
    if not user:
        return jsonify({"error": "mentor not found"}), 404

    profile = user.mentor_profile
    if not profile:
        profile = MentorProfile(user_id=user.id, status=new_status)
        db.session.add(profile)
    else:
        profile.status = new_status

    if new_status == "suspended":
        user.status = "suspended"
    elif user.status == "suspended":
        user.status = "active"

    db.session.commit()
    return jsonify({"id": user.id, "status": profile.status}), 200


@admin_bp.get("/cohorts")
@admin_required
def list_cohorts():
    cohorts = Cohort.query.order_by(Cohort.id).all()
    return jsonify({"cohorts": [c.to_dict() for c in cohorts], "total": len(cohorts)}), 200


@admin_bp.get("/stats")
@admin_required
def stats():
    total_students = User.query.filter_by(role="student").count()
    total_mentors = User.query.filter_by(role="mentor").count()
    total_admins = User.query.filter_by(role="admin").count()
    active_cohorts = Cohort.query.filter_by(status="active").count()
    approved_mentors = (
        db.session.query(MentorProfile).filter_by(status="approved").count()
    )
    pending_mentors = (
        db.session.query(MentorProfile).filter_by(status="pending").count()
    )

    # average mastery across student memberships
    mastery_rows = (
        db.session.query(CohortMember.mastery)
        .filter(
            CohortMember.member_role == "student",
            CohortMember.mastery.isnot(None),
        )
        .all()
    )
    scores = [r[0] for r in mastery_rows]
    avg_mastery = round(sum(scores) / len(scores)) if scores else 0

    return jsonify(
        {
            "totalActiveUsers": total_students + total_mentors + total_admins,
            "students": total_students,
            "mentors": total_mentors,
            "approvedMentors": approved_mentors,
            "pendingMentors": pending_mentors,
            "activeCohorts": active_cohorts,
            "avgMastery": avg_mastery,
        }
    ), 200
