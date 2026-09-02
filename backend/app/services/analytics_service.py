from datetime import datetime, timedelta
from sqlalchemy import func, and_
from app import db
from app.models import Pairing, User, Notification


class AnalyticsService:
    """Service for generating analytics and statistics."""

    @staticmethod
    def get_pairing_history(user_id, limit=10):
        """Get pairing history for a user."""
        pairings = Pairing.query.filter(
            (Pairing.student_id == user_id) | (Pairing.partner_id == user_id)
        ).order_by(Pairing.created_at.desc()).limit(limit).all()

        return [
            {
                "id": pairing.id,
                "partner_id": pairing.partner_id if pairing.student_id == user_id else pairing.student_id,
                "partner_name": pairing.partner.name if pairing.student_id == user_id else pairing.student.name,
                "week": pairing.week.isoformat() if pairing.week else None,
                "cohort": pairing.cohort,
                "focus": pairing.focus,
                "status": pairing.status,
                "created_at": pairing.created_at.isoformat() if pairing.created_at else None,
            }
            for pairing in pairings
        ]

    @staticmethod
    def get_user_pairing_stats(user_id):
        """Get pairing statistics for a user."""
        total_pairings = Pairing.query.filter(
            (Pairing.student_id == user_id) | (Pairing.partner_id == user_id)
        ).count()

        active_pairings = Pairing.query.filter(
            and_(
                (Pairing.student_id == user_id) | (Pairing.partner_id == user_id),
                Pairing.status == "active"
            )
        ).count()

        completed_pairings = Pairing.query.filter(
            and_(
                (Pairing.student_id == user_id) | (Pairing.partner_id == user_id),
                Pairing.status == "completed"
            )
        ).count()

        return {
            "total_pairings": total_pairings,
            "active_pairings": active_pairings,
            "completed_pairings": completed_pairings,
        }

    @staticmethod
    def get_cohort_statistics(cohort=None):
        """Get statistics for a cohort or all cohorts."""
        if cohort:
            pairings = Pairing.query.filter_by(cohort=cohort).all()
        else:
            pairings = Pairing.query.all()

        total_pairings = len(pairings)
        active_pairings = len([p for p in pairings if p.status == "active"])
        completed_pairings = len([p for p in pairings if p.status == "completed"])

        # Count unique students
        students = set()
        for pairing in pairings:
            students.add(pairing.student_id)
            students.add(pairing.partner_id)

        return {
            "cohort": cohort or "all",
            "total_pairings": total_pairings,
            "active_pairings": active_pairings,
            "completed_pairings": completed_pairings,
            "unique_students": len(students),
        }

    @staticmethod
    def get_weekly_pairing_trend(weeks=4):
        """Get pairing trend over the last N weeks."""
        trend = []
        today = datetime.utcnow().date()

        for i in range(weeks, 0, -1):
            week_start = today - timedelta(weeks=i)
            week_end = week_start + timedelta(days=7)

            count = Pairing.query.filter(
                and_(
                    Pairing.week >= week_start,
                    Pairing.week < week_end
                )
            ).count()

            trend.append({
                "week": week_start.isoformat(),
                "pairings": count,
            })

        return trend

    @staticmethod
    def get_focus_area_statistics():
        """Get statistics on focus areas."""
        focus_areas = db.session.query(
            Pairing.focus,
            func.count(Pairing.id).label("count")
        ).filter(
            Pairing.focus.isnot(None)
        ).group_by(Pairing.focus).all()

        return [
            {
                "focus": area[0],
                "count": area[1],
            }
            for area in focus_areas
        ]
