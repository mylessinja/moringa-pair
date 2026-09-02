from datetime import datetime, timedelta
from sqlalchemy import func, and_
from models import db, Pairing, User, Notification, Cohort


class AnalyticsService:
    """Service for generating analytics and statistics."""

    @staticmethod
    def get_pairing_history(user_id, limit=10):
        """Get pairing history for a user."""
        pairings = Pairing.query.filter(
            (Pairing.student_a_id == user_id) | (Pairing.student_b_id == user_id)
        ).order_by(Pairing.created_at.desc()).limit(limit).all()

        return [
            {
                "id": pairing.id,
                "partner_id": pairing.student_b_id if pairing.student_a_id == user_id else pairing.student_a_id,
                "partner_name": pairing.student_b.name if pairing.student_a_id == user_id else pairing.student_a.name,
                "week": pairing.week_start.isoformat() if pairing.week_start else None,
                "cohort_id": pairing.cohort_id,
                "cohort_name": pairing.cohort.name if pairing.cohort else None,
                "focus": pairing.focus,
                "created_at": pairing.created_at.isoformat() if pairing.created_at else None,
            }
            for pairing in pairings
        ]

    @staticmethod
    def get_user_pairing_stats(user_id):
        """Get pairing statistics for a user."""
        total_pairings = Pairing.query.filter(
            (Pairing.student_a_id == user_id) | (Pairing.student_b_id == user_id)
        ).count()

        # Get unique cohorts the user has been paired in
        cohort_count = db.session.query(func.count(func.distinct(Pairing.cohort_id))).filter(
            (Pairing.student_a_id == user_id) | (Pairing.student_b_id == user_id)
        ).scalar()

        # Get unique partners
        partners_a = db.session.query(func.count(func.distinct(Pairing.student_b_id))).filter(
            Pairing.student_a_id == user_id
        ).scalar() or 0

        partners_b = db.session.query(func.count(func.distinct(Pairing.student_a_id))).filter(
            Pairing.student_b_id == user_id
        ).scalar() or 0

        unique_partners = len(set(
            [p.student_b_id for p in Pairing.query.filter_by(student_a_id=user_id).all()] +
            [p.student_a_id for p in Pairing.query.filter_by(student_b_id=user_id).all()]
        ))

        return {
            "total_pairings": total_pairings,
            "cohorts_participated": cohort_count or 0,
            "unique_partners": unique_partners,
        }

    @staticmethod
    def get_cohort_statistics(cohort_id=None):
        """Get statistics for a cohort or all cohorts."""
        if cohort_id:
            pairings = Pairing.query.filter_by(cohort_id=cohort_id).all()
            cohort = Cohort.query.get(cohort_id)
            cohort_name = cohort.name if cohort else f"Cohort {cohort_id}"
        else:
            pairings = Pairing.query.all()
            cohort_name = "all"

        total_pairings = len(pairings)

        # Count unique students
        students = set()
        for pairing in pairings:
            students.add(pairing.student_a_id)
            students.add(pairing.student_b_id)

        return {
            "cohort": cohort_name,
            "total_pairings": total_pairings,
            "unique_students": len(students),
        }

    @staticmethod
    def get_weekly_pairing_trend(weeks=4, cohort_id=None):
        """Get pairing trend over the last N weeks."""
        trend = []
        today = datetime.utcnow().date()

        for i in range(weeks, 0, -1):
            week_start = today - timedelta(weeks=i)
            week_end = week_start + timedelta(days=7)

            query = Pairing.query.filter(
                and_(
                    Pairing.week_start >= week_start,
                    Pairing.week_start < week_end
                )
            )

            if cohort_id:
                query = query.filter_by(cohort_id=cohort_id)

            count = query.count()

            trend.append({
                "week": week_start.isoformat(),
                "pairings": count,
            })

        return trend

    @staticmethod
    def get_focus_area_statistics(cohort_id=None):
        """Get statistics on focus areas."""
        query = Pairing.query.filter(Pairing.focus.isnot(None))

        if cohort_id:
            query = query.filter_by(cohort_id=cohort_id)

        focus_areas = db.session.query(
            Pairing.focus,
            func.count(Pairing.id).label("count")
        ).filter(Pairing.focus.isnot(None))

        if cohort_id:
            focus_areas = focus_areas.filter(Pairing.cohort_id == cohort_id)

        focus_areas = focus_areas.group_by(Pairing.focus).all()

        return [
            {
                "focus": area[0],
                "count": area[1],
            }
            for area in focus_areas
        ]

    @staticmethod
    def get_student_pairing_frequency(cohort_id=None):
        """Get how frequently each student gets paired."""
        query = db.session.query(
            User.id,
            User.name,
            func.count(Pairing.id).label("pairing_count")
        ).outerjoin(
            Pairing,
            (Pairing.student_a_id == User.id) | (Pairing.student_b_id == User.id)
        )

        if cohort_id:
            query = query.join(Pairing, Pairing.cohort_id == cohort_id)

        query = query.group_by(User.id, User.name).order_by(
            func.count(Pairing.id).desc()
        )

        results = query.all()

        return [
            {
                "student_id": r[0],
                "student_name": r[1],
                "pairing_count": r[2] or 0,
            }
            for r in results
        ]
