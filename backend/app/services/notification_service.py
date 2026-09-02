from datetime import datetime
from app import db
from app.models import Notification, User


class NotificationService:
    """Service for managing notifications."""

    @staticmethod
    def create_notification(recipient_id, title, message, notification_type="general"):
        """Create a new notification."""
        notification = Notification(
            recipient_id=recipient_id,
            title=title,
            message=message,
            notification_type=notification_type,
            read=False,
        )
        db.session.add(notification)
        db.session.commit()
        return notification.to_dict()

    @staticmethod
    def get_notifications(user_id, unread_only=False, limit=20):
        """Get notifications for a user."""
        query = Notification.query.filter_by(recipient_id=user_id)

        if unread_only:
            query = query.filter_by(read=False)

        notifications = query.order_by(
            Notification.created_at.desc()
        ).limit(limit).all()

        return [notification.to_dict() for notification in notifications]

    @staticmethod
    def mark_as_read(notification_id, user_id):
        """Mark a notification as read."""
        notification = Notification.query.filter_by(
            id=notification_id,
            recipient_id=user_id
        ).first()

        if not notification:
            return None

        notification.read = True
        db.session.commit()
        return notification.to_dict()

    @staticmethod
    def mark_all_as_read(user_id):
        """Mark all notifications as read for a user."""
        Notification.query.filter_by(
            recipient_id=user_id,
            read=False
        ).update({"read": True})
        db.session.commit()
        return {"message": "All notifications marked as read"}

    @staticmethod
    def delete_notification(notification_id, user_id):
        """Delete a notification."""
        notification = Notification.query.filter_by(
            id=notification_id,
            recipient_id=user_id
        ).first()

        if not notification:
            return None

        db.session.delete(notification)
        db.session.commit()
        return {"message": "Notification deleted"}

    @staticmethod
    def get_unread_count(user_id):
        """Get count of unread notifications."""
        count = Notification.query.filter_by(
            recipient_id=user_id,
            read=False
        ).count()
        return {"unread_count": count}

    @staticmethod
    def create_pairing_notification(student_id, partner_id, partner_name, week):
        """Create a notification for a new pairing."""
        message = f"You've been paired with {partner_name} for the week of {week}. Get ready for collaboration!"
        return NotificationService.create_notification(
            student_id,
            "New Pairing Assigned",
            message,
            "pairing"
        )

    @staticmethod
    def broadcast_notification(title, message, notification_type="general", user_role=None):
        """Create a notification for multiple users."""
        query = User.query

        if user_role:
            query = query.filter_by(role=user_role)

        users = query.all()
        notifications = []

        for user in users:
            notification = NotificationService.create_notification(
                user.id,
                title,
                message,
                notification_type
            )
            notifications.append(notification)

        return notifications
