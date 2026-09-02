from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Pairing, User
from app.services.notification_service import NotificationService
from datetime import datetime

pairings_bp = Blueprint("pairings", __name__, url_prefix="/api/pairings")


@pairings_bp.route("", methods=["GET"])
@jwt_required()
def get_pairings():
    """Get all pairings or filter by parameters."""
    student_id = request.args.get("student_id", None, type=int)
    partner_id = request.args.get("partner_id", None, type=int)
    status = request.args.get("status", None)
    cohort = request.args.get("cohort", None)

    query = Pairing.query

    if student_id:
        query = query.filter_by(student_id=student_id)

    if partner_id:
        query = query.filter(
            (Pairing.student_id == partner_id) | (Pairing.partner_id == partner_id)
        )

    if status:
        query = query.filter_by(status=status)

    if cohort:
        query = query.filter_by(cohort=cohort)

    pairings = query.all()

    return jsonify({
        "success": True,
        "data": [pairing.to_dict() for pairing in pairings]
    }), 200


@pairings_bp.route("", methods=["POST"])
@jwt_required()
def create_pairing():
    """Create a new pairing."""
    data = request.get_json()

    if not data or not data.get("student_id") or not data.get("partner_id") or not data.get("week"):
        return jsonify({
            "success": False,
            "error": "Missing required fields: student_id, partner_id, week"
        }), 400

    # Verify both students exist
    student = User.query.get(data["student_id"])
    partner = User.query.get(data["partner_id"])

    if not student or not partner:
        return jsonify({
            "success": False,
            "error": "Student or partner not found"
        }), 404

    pairing = Pairing(
        student_id=data["student_id"],
        partner_id=data["partner_id"],
        week=datetime.fromisoformat(data["week"]).date(),
        cohort=data.get("cohort"),
        focus=data.get("focus"),
        status=data.get("status", "active")
    )

    db.session.add(pairing)
    db.session.commit()

    # Create notification for the student
    NotificationService.create_pairing_notification(
        data["student_id"],
        data["partner_id"],
        partner.name,
        data["week"]
    )

    # Create notification for the partner
    NotificationService.create_pairing_notification(
        data["partner_id"],
        data["student_id"],
        student.name,
        data["week"]
    )

    return jsonify({
        "success": True,
        "data": pairing.to_dict()
    }), 201


@pairings_bp.route("/<int:pairing_id>", methods=["GET"])
@jwt_required()
def get_pairing(pairing_id):
    """Get a specific pairing."""
    pairing = Pairing.query.get(pairing_id)

    if not pairing:
        return jsonify({
            "success": False,
            "error": "Pairing not found"
        }), 404

    return jsonify({
        "success": True,
        "data": pairing.to_dict()
    }), 200


@pairings_bp.route("/<int:pairing_id>", methods=["PUT"])
@jwt_required()
def update_pairing(pairing_id):
    """Update a pairing."""
    pairing = Pairing.query.get(pairing_id)

    if not pairing:
        return jsonify({
            "success": False,
            "error": "Pairing not found"
        }), 404

    data = request.get_json()

    if "status" in data:
        pairing.status = data["status"]

    if "focus" in data:
        pairing.focus = data["focus"]

    if "cohort" in data:
        pairing.cohort = data["cohort"]

    db.session.commit()

    return jsonify({
        "success": True,
        "data": pairing.to_dict()
    }), 200


@pairings_bp.route("/<int:pairing_id>", methods=["DELETE"])
@jwt_required()
def delete_pairing(pairing_id):
    """Delete a pairing."""
    pairing = Pairing.query.get(pairing_id)

    if not pairing:
        return jsonify({
            "success": False,
            "error": "Pairing not found"
        }), 404

    db.session.delete(pairing)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Pairing deleted"
    }), 200
