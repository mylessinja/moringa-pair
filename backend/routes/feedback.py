from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import db, User, Feedback, CohortMember

feedback_bp = Blueprint("feedback", __name__, url_prefix="/api/feedback")

SESSION_TYPES = ("1:1 session", "Code review", "Pairing check-in")


def _current_user():
    return User.query.get(int(get_jwt_identity()))


def _shares_a_cohort(mentor_id, student_id):
    mentor_cohorts = {
        m.cohort_id
        for m in CohortMember.query.filter_by(user_id=mentor_id, member_role="mentor").all()
    }
    student_cohorts = {
        m.cohort_id
        for m in CohortMember.query.filter_by(user_id=student_id, member_role="student").all()
    }
    return bool(mentor_cohorts & student_cohorts)


@feedback_bp.post("")
@jwt_required()
def create_feedback():
    user = _current_user()
    if not user or user.role not in ("mentor", "admin"):
        return jsonify({"error": "mentor or admin access required"}), 403

    data = request.get_json(silent=True) or {}
    student_id = data.get("student_id")
    session_type = data.get("session_type")
    note = (data.get("note") or "").strip()

    if session_type not in SESSION_TYPES:
        return jsonify({"error": f"session_type must be one of {SESSION_TYPES}"}), 400
    if not note:
        return jsonify({"error": "note is required"}), 400

    student = User.query.filter_by(id=student_id, role="student").first()
    if not student:
        return jsonify({"error": "student not found"}), 404

    if user.role == "mentor" and not _shares_a_cohort(user.id, student.id):
        return jsonify({"error": "you can only leave feedback for students in your own cohort"}), 403

    feedback = Feedback(
        mentor_id=user.id,
        student_id=student.id,
        session_type=session_type,
        note=note,
    )
    db.session.add(feedback)
    db.session.commit()
    return jsonify(feedback.to_dict()), 201


@feedback_bp.get("/student/<int:student_id>")
@jwt_required()
def student_feedback(student_id):
    user = _current_user()
    if not user:
        return jsonify({"error": "not authorized"}), 403

    is_self = user.id == student_id
    is_staff = user.role in ("admin", "mentor")
    if not (is_self or is_staff):
        return jsonify({"error": "not authorized"}), 403

    entries = (
        Feedback.query.filter_by(student_id=student_id)
        .order_by(Feedback.created_at.desc())
        .all()
    )
    return jsonify({"feedback": [f.to_dict() for f in entries], "total": len(entries)}), 200


@feedback_bp.get("/mentor/me")
@jwt_required()
def my_given_feedback():
    user = _current_user()
    if not user or user.role != "mentor":
        return jsonify({"error": "mentor access required"}), 403

    entries = (
        Feedback.query.filter_by(mentor_id=user.id)
        .order_by(Feedback.created_at.desc())
        .all()
    )
    return jsonify({"feedback": [f.to_dict() for f in entries], "total": len(entries)}), 200
