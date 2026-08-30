from datetime import datetime, timezone
from models import db


class Feedback(db.Model):
    __tablename__ = "feedback"

    id = db.Column(db.Integer, primary_key=True)
    mentor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    session_type = db.Column(db.String(50), nullable=False)
    note = db.Column(db.Text, nullable=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), index=True
    )

    mentor = db.relationship("User", foreign_keys=[mentor_id])
    student = db.relationship("User", foreign_keys=[student_id])

    def to_dict(self):
        return {
            "id": self.id,
            "mentor_id": self.mentor_id,
            "mentor_name": self.mentor.name if self.mentor else None,
            "student_id": self.student_id,
            "student_name": self.student.name if self.student else None,
            "session_type": self.session_type,
            "note": self.note,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
