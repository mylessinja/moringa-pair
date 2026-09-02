from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models import User, Pairing
from app.services.pairing_service import PairingService

pairings_bp = Blueprint("pairings", __name__, url_prefix="/api/pairings")


@pairings_bp.route("/", methods=["GET"])
@jwt_required()
def get_all_pairings():
    """Get all pairings (admin only)."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != "admin":
        return jsonify({"error": "Admin access required"}), 403

    week = request.args.get("week")
    cohort = request.args.get("cohort")

    query = Pairing.query

    if week:
        try:
            week_date = datetime.fromisoformat(week).date()
            query = query.filter_by(week=week_date)
        except ValueError:
            return jsonify({"error": "Invalid week format. Use YYYY-MM-DD"}), 400

    if cohort:
        query = query.filter_by(cohort=cohort)

    pairings = query.all()
    return jsonify([pairing.to_dict() for pairing in pairings]), 200


@pairings_bp.route("/create", methods=["POST"])
@jwt_required()
def create_pairing():
    """Create a new pairing manually (admin only)."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != "admin":
        return jsonify({"error": "Admin access required"}), 403

    data = request.get_json()

    if not data or not all(k in data for k in ["student_id", "partner_id", "week"]):
        return jsonify({"error": "Missing required fields: student_id, partner_id, week"}), 400

    try:
        week_date = datetime.fromisoformat(data["week"]).date()
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid week format. Use YYYY-MM-DD"}), 400

    student_id = data.get("student_id")
    partner_id = data.get("partner_id")
    cohort = data.get("cohort")
    focus = data.get("focus")

    # Verify both users exist and are students
    student = User.query.get(student_id)
    partner = User.query.get(partner_id)

    if not student or not partner:
        return jsonify({"error": "One or both users not found"}), 404

    if student.role != "student" or partner.role != "student":
        return jsonify({"error": "Both users must be students"}), 400

    success, result = PairingService.create_pairing(
        student_id, partner_id, week_date, cohort, focus
    )

    if not success:
        return jsonify({"error": result}), 400

    return jsonify({
        "message": "Pairing created successfully",
        "pairing": result.to_dict()
    }), 201


@pairings_bp.route("/auto-pair", methods=["POST"])
@jwt_required()
def auto_pair():
    """Automatically pair all students for a given week (admin only)."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != "admin":
        return jsonify({"error": "Admin access required"}), 403

    data = request.get_json() or {}

    if "week" not in data:
        return jsonify({"error": "Missing required field: week"}), 400

    try:
        week_date = datetime.fromisoformat(data["week"]).date()
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid week format. Use YYYY-MM-DD"}), 400

    cohort = data.get("cohort")
    focus = data.get("focus")

    success, pairings, stats = PairingService.auto_pair_students(
        week_date, cohort, focus
    )

    if not success:
        return jsonify({"error": pairings}), 400

    return jsonify({
        "message": "Auto-pairing completed",
        "pairings": [p.to_dict() for p in pairings],
        "stats": stats
    }), 201


@pairings_bp.route("/current", methods=["GET"])
@jwt_required()
def get_current_pairing():
    """Get the current pairing for the authenticated student."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({"error": "User not found"}), 404

    pairing = PairingService.get_current_pairing(current_user_id)

    if not pairing:
        return jsonify({"message": "No active pairing for this week"}), 404

    return jsonify(pairing.to_dict()), 200


@pairings_bp.route("/partner", methods=["GET"])
@jwt_required()
def get_partner():
    """Get the partner for the authenticated student."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({"error": "User not found"}), 404

    week_param = request.args.get("week")
    week = None

    if week_param:
        try:
            week = datetime.fromisoformat(week_param).date()
        except ValueError:
            return jsonify({"error": "Invalid week format. Use YYYY-MM-DD"}), 400

    partner = PairingService.get_partner(current_user_id, week)

    if not partner:
        return jsonify({"message": "No partner found for this period"}), 404

    return jsonify({
        "id": partner.id,
        "name": partner.name,
        "email": partner.email,
        "learning_preferences": partner.learning_preferences
    }), 200


@pairings_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    """Get pairing history for the authenticated student."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({"error": "User not found"}), 404

    limit = request.args.get("limit", default=10, type=int)

    if limit < 1 or limit > 100:
        limit = 10

    pairings = PairingService.get_pairing_history(current_user_id, limit)

    return jsonify([pairing.to_dict() for pairing in pairings]), 200


@pairings_bp.route("/<int:pairing_id>/status", methods=["PATCH"])
@jwt_required()
def update_status(pairing_id):
    """Update the status of a pairing (admin only)."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != "admin":
        return jsonify({"error": "Admin access required"}), 403

    data = request.get_json()

    if not data or "status" not in data:
        return jsonify({"error": "Missing required field: status"}), 400

    new_status = data.get("status")
    valid_statuses = ["active", "completed", "cancelled"]

    if new_status not in valid_statuses:
        return jsonify({
            "error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        }), 400

    success, result = PairingService.update_pairing_status(pairing_id, new_status)

    if not success:
        return jsonify({"error": result}), 404

    return jsonify({
        "message": "Pairing status updated",
        "pairing": result.to_dict()
    }), 200


@pairings_bp.route("/<int:pairing_id>", methods=["GET"])
@jwt_required()
def get_pairing(pairing_id):
    """Get details of a specific pairing."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({"error": "User not found"}), 404

    pairing = Pairing.query.get(pairing_id)

    if not pairing:
        return jsonify({"error": "Pairing not found"}), 404

    # Check if user is part of this pairing or is admin
    if (current_user.role != "admin" and
        pairing.student_id != current_user_id and
        pairing.partner_id != current_user_id):
        return jsonify({"error": "Access denied"}), 403

    return jsonify(pairing.to_dict()), 200


@pairings_bp.route("/user/<int:user_id>/history", methods=["GET"])
@jwt_required()
def get_user_history(user_id):
    """Get pairing history for a specific user (admin only or user themselves)."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({"error": "User not found"}), 404

    # Only allow user to view their own history or admin to view any
    if current_user.role != "admin" and current_user_id != user_id:
        return jsonify({"error": "Access denied"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    limit = request.args.get("limit", default=10, type=int)
    if limit < 1 or limit > 100:
        limit = 10

    pairings = PairingService.get_pairing_history(user_id, limit)

    return jsonify([pairing.to_dict() for pairing in pairings]), 200
