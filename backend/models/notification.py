from datetime import datetime, timezone
from models import db


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    recipient_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    notification_type = db.Column(db.String(50), nullable=False, default="general")
    read = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), index=True
    )

    recipient = db.relationship("User", foreign_keys=[recipient_id])

    def to_dict(self):
        return {
            "id": self.id,
            "recipient_id": self.recipient_id,
            "title": self.title,
            "message": self.message,
            "notification_type": self.notification_type,
            "read": self.read,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
