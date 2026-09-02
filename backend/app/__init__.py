from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    from app.models import User, Pairing, Notification
    from app.routes import auth, students, pairings, analytics, notifications

    @app.route("/")
    def health_check():
        return jsonify({"message": "MoringaPair API is running!"})

    # Register blueprints
    app.register_blueprint(auth.auth_bp)
    app.register_blueprint(students.students_bp)
    app.register_blueprint(pairings.pairings_bp)
    app.register_blueprint(analytics.analytics_bp)
    app.register_blueprint(notifications.notifications_bp)

    return app
