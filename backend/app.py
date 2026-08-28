from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    JWTManager(app)

    with app.app_context():
        import os
        os.makedirs(app.instance_path, exist_ok=True)
        # ensure sqlite path uses instance folder
        if app.config["SQLALCHEMY_DATABASE_URI"].startswith("sqlite:///"):
            db_path = os.path.join(app.instance_path, "moringa_pair.db")
            app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + db_path
        db.create_all()

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
