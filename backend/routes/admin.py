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
    AuditLog,
)
from services.audit_service import log_action

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


def _current_user():
    return User.query.get(int(get_jwt_identity()))


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

    log_action(
        _current_user(),
        f"{'Approved' if new_status == 'approved' else new_status.capitalize()} mentor",
        f"{user.name}'s mentor status set to {new_status}",
    )
    db.session.commit()
    return jsonify({"id": user.id, "status": profile.status}), 200


@admin_bp.get("/cohorts")
@admin_required
def list_cohorts():
    cohorts = Cohort.query.order_by(Cohort.id).all()
    return jsonify({"cohorts": [c.to_dict() for c in cohorts], "total": len(cohorts)}), 200


@admin_bp.get("/cohorts/<int:cohort_id>")
@admin_required
def get_cohort(cohort_id):
    cohort = Cohort.query.get(cohort_id)
    if not cohort:
        return jsonify({"error": "cohort not found"}), 404

    data = cohort.to_dict()
    data["members"] = [m.to_dict() for m in cohort.members]
    return jsonify(data), 200


@admin_bp.post("/cohorts")
@admin_required
def create_cohort():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    track = (data.get("track") or "").strip()

    if not name or not track:
        return jsonify({"error": "name and track are required"}), 400

    if Cohort.query.filter_by(name=name).first():
        return jsonify({"error": f"a cohort named '{name}' already exists"}), 409

    lead_mentor_id = data.get("lead_mentor_id")
    if lead_mentor_id is not None:
        mentor = User.query.filter_by(id=lead_mentor_id, role="mentor").first()
        if not mentor:
            return jsonify({"error": "lead_mentor_id must reference an existing mentor"}), 400

    cohort = Cohort(
        name=name,
        track=track,
        status=(data.get("status") or "active"),
        week_of_syllabus=data.get("week_of_syllabus", 1),
        total_weeks=data.get("total_weeks", 12),
        lead_mentor_id=lead_mentor_id,
    )
    db.session.add(cohort)
    log_action(_current_user(), "Created cohort", f"Cohort '{cohort.name}' created")
    db.session.commit()
    return jsonify(cohort.to_dict()), 201


@admin_bp.patch("/cohorts/<int:cohort_id>")
@admin_required
def update_cohort(cohort_id):
    cohort = Cohort.query.get(cohort_id)
    if not cohort:
        return jsonify({"error": "cohort not found"}), 404

    data = request.get_json(silent=True) or {}

    if "name" in data:
        new_name = (data["name"] or "").strip()
        if not new_name:
            return jsonify({"error": "name cannot be empty"}), 400
        existing = Cohort.query.filter(
            Cohort.name == new_name, Cohort.id != cohort_id
        ).first()
        if existing:
            return jsonify({"error": f"a cohort named '{new_name}' already exists"}), 409
        cohort.name = new_name

    if "track" in data:
        track = (data["track"] or "").strip()
        if not track:
            return jsonify({"error": "track cannot be empty"}), 400
        cohort.track = track

    if "status" in data:
        if data["status"] not in ("active", "upcoming", "archived"):
            return jsonify({"error": "status must be active, upcoming, or archived"}), 400
        cohort.status = data["status"]

    if "week_of_syllabus" in data:
        cohort.week_of_syllabus = data["week_of_syllabus"]

    if "total_weeks" in data:
        cohort.total_weeks = data["total_weeks"]

    if "lead_mentor_id" in data:
        lead_mentor_id = data["lead_mentor_id"]
        if lead_mentor_id is not None:
            mentor = User.query.filter_by(id=lead_mentor_id, role="mentor").first()
            if not mentor:
                return jsonify({"error": "lead_mentor_id must reference an existing mentor"}), 400
        cohort.lead_mentor_id = lead_mentor_id

    log_action(_current_user(), "Edited cohort", f"Cohort '{cohort.name}' updated")
    db.session.commit()
    return jsonify(cohort.to_dict()), 200


@admin_bp.post("/cohorts/<int:cohort_id>/archive")
@admin_required
def archive_cohort(cohort_id):
    cohort = Cohort.query.get(cohort_id)
    if not cohort:
        return jsonify({"error": "cohort not found"}), 404

    cohort.status = "archived"
    log_action(_current_user(), "Archived cohort", f"Cohort '{cohort.name}' archived")
    db.session.commit()
    return jsonify(cohort.to_dict()), 200


@admin_bp.post("/cohorts/<int:cohort_id>/members")
@admin_required
def add_cohort_member(cohort_id):
    cohort = Cohort.query.get(cohort_id)
    if not cohort:
        return jsonify({"error": "cohort not found"}), 404

    data = request.get_json(silent=True) or {}
    user_id = data.get("user_id")
    member_role = data.get("member_role")

    if member_role not in ("student", "mentor"):
        return jsonify({"error": "member_role must be 'student' or 'mentor'"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404
    if user.role != member_role:
        return jsonify({
            "error": f"user is a '{user.role}', cannot be added as a '{member_role}'"
        }), 400

    existing = CohortMember.query.filter_by(cohort_id=cohort_id, user_id=user_id).first()
    if existing:
        return jsonify({"error": "user is already a member of this cohort"}), 409

    membership = CohortMember(
        cohort_id=cohort_id,
        user_id=user_id,
        member_role=member_role,
        mastery=0 if member_role == "student" else None,
    )
    db.session.add(membership)
    log_action(
        _current_user(),
        "Added student" if member_role == "student" else "Added mentor",
        f"{user.name} added to cohort '{cohort.name}'",
    )
    db.session.commit()
    return jsonify(membership.to_dict()), 201


@admin_bp.delete("/cohorts/<int:cohort_id>/members/<int:user_id>")
@admin_required
def remove_cohort_member(cohort_id, user_id):
    membership = CohortMember.query.filter_by(cohort_id=cohort_id, user_id=user_id).first()
    if not membership:
        return jsonify({"error": "membership not found"}), 404

    removed_user = membership.user
    cohort_name = membership.cohort.name if membership.cohort else "unknown cohort"
    db.session.delete(membership)
    log_action(
        _current_user(),
        "Removed member",
        f"{removed_user.name if removed_user else 'A user'} removed from cohort '{cohort_name}'",
    )
    db.session.commit()
    return jsonify({"removed": True}), 200


@admin_bp.get("/audit-logs")
@admin_required
def list_audit_logs():
    limit = request.args.get("limit", type=int) or 100
    logs = AuditLog.query.order_by(AuditLog.created_at.desc()).limit(limit).all()
    return jsonify({"logs": [log.to_dict() for log in logs], "total": len(logs)}), 200


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
