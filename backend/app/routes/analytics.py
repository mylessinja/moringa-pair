from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.analytics_service import AnalyticsService
from app.models import User

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api/analytics")


@analytics_bp.route("/pairing-history", methods=["GET"])
@jwt_required()
def get_pairing_history():
    """Get pairing history for the current user."""
    user_id = get_jwt_identity()
    limit = request.args.get("limit", 10, type=int)

    history = AnalyticsService.get_pairing_history(user_id, limit)

    return jsonify({
        "success": True,
        "data": history
    }), 200


@analytics_bp.route("/user-stats", methods=["GET"])
@jwt_required()
def get_user_stats():
    """Get pairing statistics for the current user."""
    user_id = get_jwt_identity()

    stats = AnalyticsService.get_user_pairing_stats(user_id)

    return jsonify({
        "success": True,
        "data": stats
    }), 200


@analytics_bp.route("/cohort-stats", methods=["GET"])
@jwt_required()
def get_cohort_stats():
    """Get statistics for a cohort."""
    cohort = request.args.get("cohort", None)

    stats = AnalyticsService.get_cohort_statistics(cohort)

    return jsonify({
        "success": True,
        "data": stats
    }), 200


@analytics_bp.route("/weekly-trend", methods=["GET"])
@jwt_required()
def get_weekly_trend():
    """Get weekly pairing trend."""
    weeks = request.args.get("weeks", 4, type=int)

    trend = AnalyticsService.get_weekly_pairing_trend(weeks)

    return jsonify({
        "success": True,
        "data": trend
    }), 200


@analytics_bp.route("/focus-areas", methods=["GET"])
@jwt_required()
def get_focus_areas():
    """Get statistics on focus areas."""
    stats = AnalyticsService.get_focus_area_statistics()

    return jsonify({
        "success": True,
        "data": stats
    }), 200
