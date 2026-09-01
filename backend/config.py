import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-me")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///" + os.path.join(BASE_DIR, "instance", "moringa_pair.db"),
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-dev-secret-change-me")
    # Library default is 15 min, too short for a local dev session where
    # you're testing on and off for hours. Revisit before production -
    # a short-lived token plus a real refresh flow is the safer setup
    # once this actually ships.
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)
