from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from models.user import User
from models.mentor import MentorProfile, MentorExpertise
from models.cohort import Cohort, CohortMember
from models.pairing import Pairing
from models.settings import Setting
from models.notification import Notification

__all__ = [
    "db",
    "User",
    "MentorProfile",
    "MentorExpertise",
    "Cohort",
    "CohortMember",
    "Pairing",
    "Setting",
]
