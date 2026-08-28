from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from models import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="student")
    # admin | mentor | student
    status = db.Column(db.String(20), nullable=False, default="active")
    # active | inactive | suspended
    last_active_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    mentor_profile = db.relationship(
        "MentorProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    expertise = db.relationship(
        "MentorExpertise",
        back_populates="mentor",
        cascade="all, delete-orphan",
    )
    cohort_memberships = db.relationship(
        "CohortMember",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    led_cohorts = db.relationship(
        "Cohort",
        back_populates="lead_mentor",
        foreign_keys="Cohort.lead_mentor_id",
    )

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self, include_mentor=False):
        data = {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "status": self.status,
            "last_active_at": self.last_active_at.isoformat() if self.last_active_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_mentor and self.mentor_profile:
            data["mentor"] = self.mentor_profile.to_dict()
            data["expertise"] = [e.skill for e in self.expertise]
        return data
