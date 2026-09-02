from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import Cohort, Pairing, User
from services.pairing_service import (
    PairingError,
    preview_pairings,
    persist_pairs,
    generate_pairings,
)
from services.ai_pairing import preview_pairings_ai

pairings_bp = Blueprint("pairings", __name__, url_prefix="/api/pairings")


def _current_user():
    return User.query.get(int(get_jwt_identity()))


def _can_manage_cohort(user, cohort):
    if not user:
        return False
    if user.role == "admin":
        return True
    return cohort.lead_mentor_id == user.id


def _parse_date(value):
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except (TypeError, ValueError):
        return None


@pairings_bp.post("/preview")
@jwt_required()
def preview():
    user = _current_user()
    if not user or user.role not in ("admin", "mentor"):
        return jsonify({"error": "admin or mentor access required"}), 403

    data = request.get_json(silent=True) or {}
    cohort_id = data.get("cohort_id")
    week_start = _parse_date(data.get("week_start"))
    focus = data.get("focus")
    mode = (data.get("mode") or "balanced").lower()
    lookback = int(data.get("lookback_weeks") or 4)

    if not cohort_id or not week_start:
        return jsonify({"error": "cohort_id and week_start (YYYY-MM-DD) are required"}), 400

    cohort = Cohort.query.get(cohort_id)
    if not cohort:
        return jsonify({"error": "cohort not found"}), 404
    if not _can_manage_cohort(user, cohort):
        return jsonify({"error": "not authorized for this cohort"}), 403

    try:
        if mode == "ai":
            result = preview_pairings_ai(
                cohort_id, week_start, focus=focus, lookback_weeks=lookback
            )
        else:
            result = preview_pairings(
                cohort_id,
                week_start,
                focus=focus,
                lookback_weeks=lookback,
                mode=mode if mode in ("random", "balanced") else "balanced",
            )
    except PairingError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(result), 200


@pairings_bp.post("/publish")
@jwt_required()
def publish():
    user = _current_user()
    if not user or user.role not in ("admin", "mentor"):
        return jsonify({"error": "admin or mentor access required"}), 403

    data = request.get_json(silent=True) or {}
    cohort_id = data.get("cohort_id")
    week_start = _parse_date(data.get("week_start"))
    focus = data.get("focus")
    pairs = data.get("pairs") or []

    if not cohort_id or not week_start:
        return jsonify({"error": "cohort_id and week_start are required"}), 400
    if not pairs:
        return jsonify({"error": "pairs array is required"}), 400

    cohort = Cohort.query.get(cohort_id)
    if not cohort:
        return jsonify({"error": "cohort not found"}), 404
    if not _can_manage_cohort(user, cohort):
        return jsonify({"error": "not authorized for this cohort"}), 403

    try:
        result = persist_pairs(
            cohort_id, week_start, pairs, focus=focus, triggered_by=user
        )
    except PairingError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(result), 201


@pairings_bp.post("/generate")
@jwt_required()
def generate():
    """One-shot: balanced generate + persist (legacy)."""
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
        return jsonify({"error": "not authorized for this cohort"}), 403

    try:
        result = generate_pairings(
            cohort_id, week_start, focus=focus, triggered_by=user
        )
    except PairingError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(result), 201


@pairings_bp.post("/generate-ai")
@jwt_required()
def generate_ai():
    user = _current_user()
    if not user or user.role not in ("admin", "mentor"):
        return jsonify({"error": "admin or mentor access required"}), 403

    data = request.get_json(silent=True) or {}
    cohort_id = data.get("cohort_id")
    week_start = _parse_date(data.get("week_start"))
    focus = data.get("focus")
    lookback = int(data.get("lookback_weeks") or 4)
    persist = bool(data.get("persist", False))

    if not cohort_id or not week_start:
        return jsonify({"error": "cohort_id and week_start are required"}), 400

    cohort = Cohort.query.get(cohort_id)
    if not cohort:
        return jsonify({"error": "cohort not found"}), 404
    if not _can_manage_cohort(user, cohort):
        return jsonify({"error": "not authorized for this cohort"}), 403

    try:
        preview = preview_pairings_ai(
            cohort_id, week_start, focus=focus, lookback_weeks=lookback
        )
        if persist:
            saved = persist_pairs(
                cohort_id, week_start, preview["pairs"], focus=focus, triggered_by=user
            )
            return jsonify({"preview": preview, "saved": saved}), 201
    except PairingError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(preview), 200


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
            return jsonify({"error": "not authorized"}), 403

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
