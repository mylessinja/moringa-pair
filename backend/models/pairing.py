from datetime import datetime, timezone
from models import db


class Pairing(db.Model):
    __tablename__ = "pairings"
    __table_args__ = (
        db.UniqueConstraint(
            "cohort_id", "week_start", "student_a_id", "student_b_id",
            name="uq_pairing_week",
        ),
    )

    id = db.Column(db.Integer, primary_key=True)
    cohort_id = db.Column(db.Integer, db.ForeignKey("cohorts.id"), nullable=False)
    week_start = db.Column(db.Date, nullable=False)
    student_a_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    student_b_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    focus = db.Column(db.String(200), nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    cohort = db.relationship("Cohort", back_populates="pairings")
    student_a = db.relationship("User", foreign_keys=[student_a_id])
    student_b = db.relationship("User", foreign_keys=[student_b_id])

    def to_dict(self):
        return {
            "id": self.id,
            "cohort_id": self.cohort_id,
            "week_start": self.week_start.isoformat() if self.week_start else None,
            "student_a_id": self.student_a_id,
            "student_b_id": self.student_b_id,
            "student_a": self.student_a.name if self.student_a else None,
            "student_b": self.student_b.name if self.student_b else None,
            "focus": self.focus,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
