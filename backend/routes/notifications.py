from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import db, Notification, User
from services.email_service import EmailService

notifications_bp = Blueprint("notifications", __name__, url_prefix="/api/notifications")


def _current_user_id():
    return int(get_jwt_identity())


@notifications_bp.get("")
@jwt_required()
def list_notifications():
    user_id = _current_user_id()
    unread_only = request.args.get("unread_only", "").lower() == "true"

    query = Notification.query.filter_by(recipient_id=user_id)
    if unread_only:
        query = query.filter_by(read=False)

    notifications = query.order_by(Notification.created_at.desc()).all()
    return jsonify({
        "notifications": [n.to_dict() for n in notifications],
        "total": len(notifications),
    }), 200


@notifications_bp.get("/unread-count")
@jwt_required()
def unread_count():
    user_id = _current_user_id()
    count = Notification.query.filter_by(recipient_id=user_id, read=False).count()
    return jsonify({"unread_count": count}), 200


@notifications_bp.patch("/<int:notification_id>/read")
@jwt_required()
def mark_read(notification_id):
    user_id = _current_user_id()
    notification = Notification.query.get(notification_id)

    if not notification:
        return jsonify({"error": "notification not found"}), 404
    if notification.recipient_id != user_id:
        return jsonify({"error": "not authorized"}), 403

    notification.read = True
    db.session.commit()
    return jsonify(notification.to_dict()), 200


@notifications_bp.post("/read-all")
@jwt_required()
def mark_all_read():
    user_id = _current_user_id()
    updated = Notification.query.filter_by(recipient_id=user_id, read=False).update(
        {"read": True}
    )
    db.session.commit()
    return jsonify({"marked_read": updated}), 200


@notifications_bp.post("/send-pairing-email")
@jwt_required()
def send_pairing_email():
    """Send pairing notification email to a user."""
    user_id = _current_user_id()
    data = request.get_json(silent=True) or {}

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404

    partner_name = data.get("partner_name", "Your Partner")
    cohort = data.get("cohort", "Cohort")
    week = data.get("week", "1")
    focus = data.get("focus", None)

    result = EmailService.send_pairing_notification(
        to_email=user.email,
        user_name=user.name,
        partner_name=partner_name,
        cohort=cohort,
        week=week,
        focus=focus,
    )

    if result["success"]:
        return jsonify({
            "success": True,
            "message": "Pairing notification email sent",
        }), 200
    else:
        return jsonify({
            "success": False,
            "error": result.get("error", "Failed to send email"),
        }), 500


@notifications_bp.post("/send-feedback-email")
@jwt_required()
def send_feedback_email():
    """Send feedback notification email to a user."""
    user_id = _current_user_id()
    data = request.get_json(silent=True) or {}

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404

    mentor_name = data.get("mentor_name", "Your Mentor")
    feedback_summary = data.get("feedback_summary", "")

    if not feedback_summary:
        return jsonify({
            "error": "feedback_summary is required",
        }), 400

    result = EmailService.send_feedback_notification(
        to_email=user.email,
        user_name=user.name,
        mentor_name=mentor_name,
        feedback_summary=feedback_summary,
    )

    if result["success"]:
        return jsonify({
            "success": True,
            "message": "Feedback notification email sent",
        }), 200
    else:
        return jsonify({
            "success": False,
            "error": result.get("error", "Failed to send email"),
        }), 500


@notifications_bp.post("/send-pairing-complete-email")
@jwt_required()
def send_pairing_complete_email():
    """Send pairing completion notification email to a user."""
    user_id = _current_user_id()
    data = request.get_json(silent=True) or {}

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404

    partner_name = data.get("partner_name", "Your Partner")

    result = EmailService.send_pairing_complete_notification(
        to_email=user.email,
        user_name=user.name,
        partner_name=partner_name,
    )

    if result["success"]:
        return jsonify({
            "success": True,
            "message": "Pairing completion email sent",
        }), 200
    else:
        return jsonify({
            "success": False,
            "error": result.get("error", "Failed to send email"),
        }), 500


@notifications_bp.post("/send-assessment-reminder-email")
@jwt_required()
def send_assessment_reminder_email():
    """Send assessment reminder email to a user."""
    user_id = _current_user_id()
    data = request.get_json(silent=True) or {}

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404

    assessment_name = data.get("assessment_name", "Assessment")
    due_date = data.get("due_date", "")

    if not due_date:
        return jsonify({
            "error": "due_date is required",
        }), 400

    result = EmailService.send_assessment_reminder(
        to_email=user.email,
        user_name=user.name,
        assessment_name=assessment_name,
        due_date=due_date,
    )

    if result["success"]:
        return jsonify({
            "success": True,
            "message": "Assessment reminder email sent",
        }), 200
    else:
        return jsonify({
            "success": False,
            "error": result.get("error", "Failed to send email"),
        }), 500
