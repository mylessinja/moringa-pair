from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import Cohort, Pairing, User
from services.pairing_service import generate_pairings, PairingError

pairings_bp = Blueprint("pairings", __name__, url_prefix="/api/pairings")


def _current_user():
    return User.query.get(int(get_jwt_identity()))


def _can_manage_cohort(user, cohort):
    if user.role == "admin":
        return True
    return cohort.lead_mentor_id == user.id


def _parse_date(value):
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except (TypeError, ValueError):
        return None


@pairings_bp.post("/generate")
@jwt_required()
def generate():
    user = _current_user()
    if not user or user.role not in ("admin", "mentor"):
        return jsonify({"error": "admin or mentor access required"}), 403

    data = request.get_json(silent=True) or {}
    cohort_id = data.get("cohort_id")
    week_start = _parse_date(data.get("week_start"))
    focus = data.get("focus")

    if not cohort_id or not week_start:
        return jsonify({"error": "cohort_id and week_start (YYYY-MM-DD) are required"}), 400

    cohort = Cohort.query.get(cohort_id)
    if not cohort:
        return jsonify({"error": "cohort not found"}), 404

    if not _can_manage_cohort(user, cohort):
        return jsonify({"error": "not authorized to generate pairings for this cohort"}), 403

    try:
        result = generate_pairings(cohort_id, week_start, focus=focus)
    except PairingError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(result), 201


@pairings_bp.get("/cohort/<int:cohort_id>")
@jwt_required()
def cohort_history(cohort_id):
    user = _current_user()
    cohort = Cohort.query.get(cohort_id)
    if not cohort:
        return jsonify({"error": "cohort not found"}), 404

    if user.role != "admin" and not _can_manage_cohort(user, cohort):
        allowed = any(m.user_id == user.id for m in cohort.members)
        if not allowed:
            return jsonify({"error": "not authorized to view this cohort's pairings"}), 403

    pairings = (
        Pairing.query.filter_by(cohort_id=cohort_id)
        .order_by(Pairing.week_start.desc())
        .all()
    )
    return jsonify({"pairings": [p.to_dict() for p in pairings], "total": len(pairings)}), 200


@pairings_bp.get("/student/<int:student_id>")
@jwt_required()
def student_history(student_id):
    user = _current_user()
    if user.id != student_id and user.role not in ("admin", "mentor"):
        return jsonify({"error": "not authorized"}), 403

    pairings = (
        Pairing.query.filter(
            (Pairing.student_a_id == student_id) | (Pairing.student_b_id == student_id)
        )
        .order_by(Pairing.week_start.desc())
        .all()
    )
    return jsonify({"pairings": [p.to_dict() for p in pairings], "total": len(pairings)}), 200
