from models import db


class MentorProfile(db.Model):
    __tablename__ = "mentor_profiles"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    status = db.Column(db.String(20), nullable=False, default="pending")
    # pending | approved | suspended
    bio = db.Column(db.Text, nullable=True)

    user = db.relationship("User", back_populates="mentor_profile")

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "status": self.status,
            "bio": self.bio,
        }


class MentorExpertise(db.Model):
    __tablename__ = "mentor_expertise"

    id = db.Column(db.Integer, primary_key=True)
    mentor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    skill = db.Column(db.String(80), nullable=False)

    mentor = db.relationship("User", back_populates="expertise")

    def to_dict(self):
        return {"id": self.id, "mentor_id": self.mentor_id, "skill": self.skill}
