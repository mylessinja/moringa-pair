import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # A local database keeps the API runnable before deployment variables exist.
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///moringa_pair.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "development-only-secret")
