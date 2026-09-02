from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from app import db
from app.models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user."""
    data = request.get_json()

    if not data or not data.get("email") or not data.get("password") or not data.get("name"):
        return jsonify({
            "success": False,
            "error": "Missing required fields: email, password, name"
        }), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({
            "success": False,
            "error": "User already exists"
        }), 409

    user = User(
        name=data["name"],
        email=data["email"],
        role=data.get("role", "student")
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "success": True,
        "data": user.to_dict()
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login a user."""
    from flask_jwt_extended import create_access_token

    data = request.get_json()

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({
            "success": False,
            "error": "Missing email or password"
        }), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({
            "success": False,
            "error": "Invalid email or password"
        }), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({
        "success": True,
        "data": {
            "user": user.to_dict(),
            "access_token": access_token
        }
    }), 200


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    """Get current user profile."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "error": "User not found"
        }), 404

    return jsonify({
        "success": True,
        "data": user.to_dict()
    }), 200


@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    """Update current user profile."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "error": "User not found"
        }), 404

    data = request.get_json()

    if "name" in data:
        user.name = data["name"]

    if "learning_preferences" in data:
        user.learning_preferences = data["learning_preferences"]

    db.session.commit()

    return jsonify({
        "success": True,
        "data": user.to_dict()
    }), 200
