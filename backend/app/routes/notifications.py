from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.notification_service import NotificationService

notifications_bp = Blueprint("notifications", __name__, url_prefix="/api/notifications")


@notifications_bp.route("", methods=["GET"])
@jwt_required()
def get_notifications():
    """Get notifications for the current user."""
    user_id = get_jwt_identity()
    unread_only = request.args.get("unread_only", False, type=bool)
    limit = request.args.get("limit", 20, type=int)

    notifications = NotificationService.get_notifications(
        user_id,
        unread_only=unread_only,
        limit=limit
    )

    return jsonify({
        "success": True,
        "data": notifications
    }), 200


@notifications_bp.route("/unread-count", methods=["GET"])
@jwt_required()
def get_unread_count():
    """Get count of unread notifications."""
    user_id = get_jwt_identity()

    result = NotificationService.get_unread_count(user_id)

    return jsonify({
        "success": True,
        "data": result
    }), 200


@notifications_bp.route("/<int:notification_id>/read", methods=["PATCH"])
@jwt_required()
def mark_as_read(notification_id):
    """Mark a notification as read."""
    user_id = get_jwt_identity()

    notification = NotificationService.mark_as_read(notification_id, user_id)

    if not notification:
        return jsonify({
            "success": False,
            "error": "Notification not found"
        }), 404

    return jsonify({
        "success": True,
        "data": notification
    }), 200


@notifications_bp.route("/mark-all-read", methods=["PATCH"])
@jwt_required()
def mark_all_read():
    """Mark all notifications as read."""
    user_id = get_jwt_identity()

    result = NotificationService.mark_all_as_read(user_id)

    return jsonify({
        "success": True,
        "data": result
    }), 200


@notifications_bp.route("/<int:notification_id>", methods=["DELETE"])
@jwt_required()
def delete_notification(notification_id):
    """Delete a notification."""
    user_id = get_jwt_identity()

    result = NotificationService.delete_notification(notification_id, user_id)

    if not result:
        return jsonify({
            "success": False,
            "error": "Notification not found"
        }), 404

    return jsonify({
        "success": True,
        "data": result
    }), 200
