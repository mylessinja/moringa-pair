from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from config import Config
from models import db



def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    import os
    os.makedirs(app.instance_path, exist_ok=True)

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    from models import (  # noqa: F401
        User,
        MentorProfile,
        MentorExpertise,
        Cohort,
        CohortMember,
        Pairing,
        Setting,
    )
    from routes.auth import auth_bp
    from routes.admin import admin_bp
    from routes.mentors import mentors_bp
    from routes.pairings import pairings_bp
    from routes.notifications import notifications_bp
    from routes.feedback import feedback_bp

    app.register_blueprint(mentors_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(pairings_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(feedback_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(feedback_bp)

    with app.app_context():
        db.create_all()

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app
