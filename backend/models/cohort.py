from datetime import datetime, timezone
from models import db


class Cohort(db.Model):
    __tablename__ = "cohorts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=True)
    track = db.Column(db.String(80), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="active")
    # active | upcoming | archived
    week_of_syllabus = db.Column(db.Integer, nullable=False, default=1)
    total_weeks = db.Column(db.Integer, nullable=False, default=12)
    lead_mentor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    lead_mentor = db.relationship(
        "User",
        back_populates="led_cohorts",
        foreign_keys=[lead_mentor_id],
    )
    members = db.relationship(
        "CohortMember",
        back_populates="cohort",
        cascade="all, delete-orphan",
    )
    pairings = db.relationship(
        "Pairing",
        back_populates="cohort",
        cascade="all, delete-orphan",
    )

    def student_count(self):
        return sum(1 for m in self.members if m.member_role == "student")

    def mentor_count(self):
        return sum(1 for m in self.members if m.member_role == "mentor")

    def avg_mastery(self):
        scores = [
            m.mastery
            for m in self.members
            if m.member_role == "student" and m.mastery is not None
        ]
        if not scores:
            return 0
        return round(sum(scores) / len(scores))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "track": self.track,
            "status": self.status,
            "week_of_syllabus": self.week_of_syllabus,
            "total_weeks": self.total_weeks,
            "lead_mentor_id": self.lead_mentor_id,
            "lead_mentor": self.lead_mentor.name if self.lead_mentor else None,
            "students": self.student_count(),
            "mentors": self.mentor_count(),
            "avg_mastery": self.avg_mastery(),
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class CohortMember(db.Model):
    __tablename__ = "cohort_members"
    __table_args__ = (
        db.UniqueConstraint("cohort_id", "user_id", name="uq_cohort_user"),
    )

    id = db.Column(db.Integer, primary_key=True)
    cohort_id = db.Column(db.Integer, db.ForeignKey("cohorts.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    member_role = db.Column(db.String(20), nullable=False)
    # student | mentor
    mastery = db.Column(db.Integer, nullable=True)  # 0–100 for students

    cohort = db.relationship("Cohort", back_populates="members")
    user = db.relationship("User", back_populates="cohort_memberships")

    def to_dict(self):
        return {
            "id": self.id,
            "cohort_id": self.cohort_id,
            "user_id": self.user_id,
            "member_role": self.member_role,
            "mastery": self.mastery,
            "user": self.user.to_dict() if self.user else None,
            "cohort_name": self.cohort.name if self.cohort else None,
        }
