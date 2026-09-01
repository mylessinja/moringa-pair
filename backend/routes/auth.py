import os
from datetime import datetime, timezone

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
)

from models import db, User, MentorProfile

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/signup")
def signup():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = (data.get("role") or "student").strip().lower()

    if not name or not email or not password:
        return jsonify({"error": "name, email, and password are required"}), 400

    if role not in ("student", "mentor", "admin"):
        return jsonify({"error": "role must be student, mentor, or admin"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "email already registered"}), 409

    user = User(name=name, email=email, role=role, status="active")
    user.set_password(password)
    db.session.add(user)
    db.session.flush()

    if role == "mentor":
        db.session.add(MentorProfile(user_id=user.id, status="pending"))

    db.session.commit()

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role, "email": user.email},
    )
    return jsonify({"access_token": token, "user": user.to_dict()}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "invalid email or password"}), 401

    if user.status == "suspended":
        return jsonify({"error": "account suspended"}), 403

    user.last_active_at = datetime.now(timezone.utc)
    db.session.commit()

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role, "email": user.email},
    )
    return jsonify({"access_token": token, "user": user.to_dict()}), 200


@auth_bp.post("/google")
def google_auth():
    data = request.get_json(silent=True) or {}
    token = data.get("id_token") or data.get("credential")
    if not token:
        return jsonify({"error": "id_token is required"}), 400

    client_id = current_app.config.get("GOOGLE_CLIENT_ID") or os.environ.get(
        "GOOGLE_CLIENT_ID", ""
    )
    if not client_id:
        return jsonify({"error": "Google sign-in is not configured"}), 503

    try:
        from google.oauth2 import id_token as google_id_token
        from google.auth.transport import requests as google_requests

        info = google_id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            client_id,
        )
    except ValueError:
        return jsonify({"error": "invalid Google token"}), 401
    except Exception as exc:
        return jsonify({"error": f"Google verification failed: {exc}"}), 401

    email = (info.get("email") or "").lower().strip()
    name = (info.get("name") or email.split("@")[0]).strip()
    if not email:
        return jsonify({"error": "Google account has no email"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(name=name, email=email, role="student", status="active")
        user.set_password(os.urandom(24).hex())
        db.session.add(user)
        db.session.commit()

    if user.status == "suspended":
        return jsonify({"error": "account suspended"}), 403

    user.last_active_at = datetime.now(timezone.utc)
    db.session.commit()

    access = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role, "email": user.email},
    )
    return jsonify({"access_token": access, "user": user.to_dict()}), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404
    return jsonify({"user": user.to_dict(include_mentor=(user.role == "mentor"))}), 200
