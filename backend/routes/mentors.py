from functools import wraps

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from models import db, User, Cohort, CohortMember, Pairing

mentors_bp = Blueprint("mentors", __name__, url_prefix="/api/mentors")


def mentor_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        role = claims.get("role")
        user = User.query.get(int(get_jwt_identity()))
        if not user:
            return jsonify({"error": "user not found"}), 404
        if role != "mentor" and user.role != "mentor":
            # allow admin to inspect as well
            if user.role != "admin":
                return jsonify({"error": "mentor access required"}), 403
        return fn(*args, **kwargs)

    return wrapper


def _current_user():
    return User.query.get(int(get_jwt_identity()))


@mentors_bp.get("/me")
@mentor_required
def my_profile():
    user = _current_user()
    if user.role not in ("mentor", "admin"):
        return jsonify({"error": "mentor access required"}), 403

    profile = user.mentor_profile
    skills = [e.skill for e in user.expertise]
    cohorts = []
    for mem in user.cohort_memberships:
        if mem.member_role == "mentor" and mem.cohort:
            cohorts.append(mem.cohort.to_dict())

    return jsonify(
        {
            "user": user.to_dict(),
            "mentor": profile.to_dict() if profile else None,
            "expertise": skills,
            "cohorts": cohorts,
        }
    ), 200


@mentors_bp.get("/cohorts")
@mentor_required
def my_cohorts():
    user = _current_user()
    cohorts = []
    for mem in user.cohort_memberships:
        if mem.member_role == "mentor" and mem.cohort:
            cohorts.append(mem.cohort.to_dict())
    # lead mentor cohorts not in memberships
    for c in user.led_cohorts:
        data = c.to_dict()
        if data not in cohorts and all(x["id"] != c.id for x in cohorts):
            cohorts.append(data)
    return jsonify({"cohorts": cohorts, "total": len(cohorts)}), 200


@mentors_bp.get("/cohorts/<int:cohort_id>/students")
@mentor_required
def cohort_students(cohort_id):
    user = _current_user()
    cohort = Cohort.query.get(cohort_id)
    if not cohort:
        return jsonify({"error": "cohort not found"}), 404

    # mentor must be assigned or lead, unless admin
    if user.role != "admin":
        allowed = cohort.lead_mentor_id == user.id or any(
            m.user_id == user.id and m.member_role == "mentor"
            for m in cohort.members
        )
        if not allowed:
            return jsonify({"error": "not assigned to this cohort"}), 403

    students = []
    for mem in cohort.members:
        if mem.member_role == "student" and mem.user:
            students.append(
                {
                    "id": mem.user.id,
                    "name": mem.user.name,
                    "email": mem.user.email,
                    "mastery": mem.mastery,
                    "status": mem.user.status,
                    "lastActive": mem.user.last_active_at.isoformat()
                    if mem.user.last_active_at
                    else None,
                }
            )

    return jsonify(
        {
            "cohort": cohort.to_dict(),
            "students": students,
            "total": len(students),
        }
    ), 200


@mentors_bp.get("/cohorts/<int:cohort_id>/pairings")
@mentor_required
def cohort_pairings(cohort_id):
    user = _current_user()
    cohort = Cohort.query.get(cohort_id)
    if not cohort:
        return jsonify({"error": "cohort not found"}), 404

    if user.role != "admin":
        allowed = cohort.lead_mentor_id == user.id or any(
            m.user_id == user.id and m.member_role == "mentor"
            for m in cohort.members
        )
        if not allowed:
            return jsonify({"error": "not assigned to this cohort"}), 403

    pairings = (
        Pairing.query.filter_by(cohort_id=cohort_id)
        .order_by(Pairing.week_start.desc())
        .all()
    )
    return jsonify(
        {
            "cohort": cohort.to_dict(),
            "pairings": [p.to_dict() for p in pairings],
            "total": len(pairings),
        }
    ), 200


@mentors_bp.patch("/cohorts/<int:cohort_id>/students/<int:student_id>/mastery")
@mentor_required
def update_mastery(cohort_id, student_id):
    user = _current_user()
    cohort = Cohort.query.get(cohort_id)
    if not cohort:
        return jsonify({"error": "cohort not found"}), 404

    if user.role != "admin":
        allowed = cohort.lead_mentor_id == user.id or any(
            m.user_id == user.id and m.member_role == "mentor"
            for m in cohort.members
        )
        if not allowed:
            return jsonify({"error": "not assigned to this cohort"}), 403

    data = request.get_json(silent=True) or {}
    mastery = data.get("mastery")
    if mastery is None or not isinstance(mastery, int) or mastery < 0 or mastery > 100:
        return jsonify({"error": "mastery must be an integer 0–100"}), 400

    membership = CohortMember.query.filter_by(
        cohort_id=cohort_id,
        user_id=student_id,
        member_role="student",
    ).first()
    if not membership:
        return jsonify({"error": "student not in this cohort"}), 404

    membership.mastery = mastery
    db.session.commit()
    return jsonify(
        {
            "student_id": student_id,
            "cohort_id": cohort_id,
            "mastery": membership.mastery,
        }
    ), 200
