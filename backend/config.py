import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-me")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///" + os.path.join(BASE_DIR, "instance", "moringa_pair.db"),
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-dev-secret-change-me")

    # Pairing / AI
    PAIRING_AI_ENABLED = os.environ.get("PAIRING_AI_ENABLED", "false").lower() == "true"
    XAI_API_KEY = os.environ.get("XAI_API_KEY", "")
    PAIRING_AI_MODEL = os.environ.get("PAIRING_AI_MODEL", "grok-2-latest")
    PAIRING_AI_BASE_URL = os.environ.get(
        "PAIRING_AI_BASE_URL", "https://api.x.ai/v1"
    )
    PAIRING_DEFAULT_LOOKBACK = int(os.environ.get("PAIRING_DEFAULT_LOOKBACK", "4"))
