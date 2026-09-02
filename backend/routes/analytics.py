from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.analytics_service import AnalyticsService

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api/analytics")


@analytics_bp.get("/pairing-history")
@jwt_required()
def get_pairing_history():
    """Get pairing history for the current user."""
    user_id = int(get_jwt_identity())
    limit = request.args.get("limit", 10, type=int)

    history = AnalyticsService.get_pairing_history(user_id, limit)

    return jsonify({
        "success": True,
        "data": history
    }), 200


@analytics_bp.get("/user-stats")
@jwt_required()
def get_user_stats():
    """Get pairing statistics for the current user."""
    user_id = int(get_jwt_identity())

    stats = AnalyticsService.get_user_pairing_stats(user_id)

    return jsonify({
        "success": True,
        "data": stats
    }), 200


@analytics_bp.get("/cohort-stats")
@jwt_required()
def get_cohort_stats():
    """Get statistics for a cohort."""
    cohort_id = request.args.get("cohort_id", None, type=int)

    stats = AnalyticsService.get_cohort_statistics(cohort_id)

    return jsonify({
        "success": True,
        "data": stats
    }), 200


@analytics_bp.get("/weekly-trend")
@jwt_required()
def get_weekly_trend():
    """Get weekly pairing trend."""
    weeks = request.args.get("weeks", 4, type=int)
    cohort_id = request.args.get("cohort_id", None, type=int)

    trend = AnalyticsService.get_weekly_pairing_trend(weeks, cohort_id)

    return jsonify({
        "success": True,
        "data": trend
    }), 200


@analytics_bp.get("/focus-areas")
@jwt_required()
def get_focus_areas():
    """Get statistics on focus areas."""
    cohort_id = request.args.get("cohort_id", None, type=int)

    stats = AnalyticsService.get_focus_area_statistics(cohort_id)

    return jsonify({
        "success": True,
        "data": stats
    }), 200


@analytics_bp.get("/student-frequency")
@jwt_required()
def get_student_frequency():
    """Get how frequently each student gets paired."""
    cohort_id = request.args.get("cohort_id", None, type=int)

    frequency = AnalyticsService.get_student_pairing_frequency(cohort_id)

    return jsonify({
        "success": True,
        "data": frequency
    }), 200
