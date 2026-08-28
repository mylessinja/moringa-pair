from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import db, Notification

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
