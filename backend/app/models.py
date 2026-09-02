from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from app import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        nullable=False,
        default="student"
    )

    learning_preferences = db.Column(
        db.Text,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(
            self.password_hash,
            password
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "learning_preferences": self.learning_preferences,
            "created_at": self.created_at.isoformat()
            if self.created_at else None
        }


class Pairing(db.Model):
    __tablename__ = "pairings"

    id = db.Column(db.Integer, primary_key=True)

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    partner_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    week = db.Column(
        db.Date,
        nullable=False,
        index=True
    )

    cohort = db.Column(
        db.String(100),
        nullable=True
    )

    focus = db.Column(
        db.String(150),
        nullable=True
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default="active"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # Relationships
    student = db.relationship(
        "User",
        foreign_keys=[student_id],
        backref="pairings_as_student"
    )
    partner = db.relationship(
        "User",
        foreign_keys=[partner_id],
        backref="pairings_as_partner"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "partner_id": self.partner_id,
            "week": self.week.isoformat() if self.week else None,
            "cohort": self.cohort,
            "focus": self.focus,
            "status": self.status,
            "created_at": self.created_at.isoformat()
            if self.created_at else None
        }


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)

    recipient_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    notification_type = db.Column(
        db.String(50),
        nullable=False
    )

    read = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        index=True
    )

    # Relationships
    recipient = db.relationship(
        "User",
        backref="notifications"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "recipient_id": self.recipient_id,
            "title": self.title,
            "message": self.message,
            "notification_type": self.notification_type,
            "read": self.read,
            "created_at": self.created_at.isoformat()
            if self.created_at else None
        }
