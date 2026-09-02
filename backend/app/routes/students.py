from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User

students_bp = Blueprint("students", __name__, url_prefix="/api/students")


@students_bp.route("", methods=["GET"])
@jwt_required()
def get_students():
    """Get all students."""
    students = User.query.filter_by(role="student").all()

    return jsonify({
        "success": True,
        "data": [student.to_dict() for student in students]
    }), 200


@students_bp.route("/<int:student_id>", methods=["GET"])
@jwt_required()
def get_student(student_id):
    """Get a specific student."""
    student = User.query.filter_by(id=student_id, role="student").first()

    if not student:
        return jsonify({
            "success": False,
            "error": "Student not found"
        }), 404

    return jsonify({
        "success": True,
        "data": student.to_dict()
    }), 200


@students_bp.route("/<int:student_id>", methods=["PUT"])
@jwt_required()
def update_student(student_id):
    """Update a student."""
    student = User.query.filter_by(id=student_id, role="student").first()

    if not student:
        return jsonify({
            "success": False,
            "error": "Student not found"
        }), 404

    data = request.get_json()

    if "name" in data:
        student.name = data["name"]

    if "learning_preferences" in data:
        student.learning_preferences = data["learning_preferences"]

    db.session.commit()

    return jsonify({
        "success": True,
        "data": student.to_dict()
    }), 200
