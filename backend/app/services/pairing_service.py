import random
from datetime import datetime, timedelta
from sqlalchemy import and_, or_

from app import db
from app.models import User, Pairing, Notification


class PairingService:
    """Service for managing student pairings."""

    @staticmethod
    def get_students():
        """Get all active students."""
        return User.query.filter_by(role="student").all()

    @staticmethod
    def is_valid_pairing(student_id, partner_id, week):
        """
        Validate if a pairing is valid.
        
        Checks:
        - Student and partner are different users
        - Pairing doesn't already exist for that week
        - No duplicate pairings in reverse order
        """
        if student_id == partner_id:
            return False, "Cannot pair a student with themselves"

        # Check for existing pairing with same pair for this week
        existing = Pairing.query.filter(
            and_(
                Pairing.week == week,
                or_(
                    and_(
                        Pairing.student_id == student_id,
                        Pairing.partner_id == partner_id
                    ),
                    and_(
                        Pairing.student_id == partner_id,
                        Pairing.partner_id == student_id
                    )
                )
            )
        ).first()

        if existing:
            return False, f"Pairing already exists for week {week}"

        return True, "Valid pairing"

    @staticmethod
    def create_pairing(student_id, partner_id, week, cohort=None, focus=None):
        """
        Create a new pairing between two students.
        
        Args:
            student_id: ID of the first student
            partner_id: ID of the second student (partner)
            week: Date representing the week
            cohort: Optional cohort identifier
            focus: Optional focus area for the pairing
            
        Returns:
            tuple: (success, pairing_or_error_message)
        """
        is_valid, message = PairingService.is_valid_pairing(
            student_id, partner_id, week
        )

        if not is_valid:
            return False, message

        try:
            pairing = Pairing(
                student_id=student_id,
                partner_id=partner_id,
                week=week,
                cohort=cohort,
                focus=focus,
                status="active"
            )
            db.session.add(pairing)
            db.session.commit()

            # Send notifications to both students
            PairingService._notify_pairing(student_id, partner_id, week)

            return True, pairing
        except Exception as e:
            db.session.rollback()
            return False, f"Error creating pairing: {str(e)}"

    @staticmethod
    def auto_pair_students(week, cohort=None, focus=None):
        """
        Automatically pair all students using random matching.
        
        Ensures:
        - No student is paired with themselves
        - No duplicate pairings
        - All available students are paired (if odd number, one remains unpaired)
        
        Args:
            week: Date representing the week
            cohort: Optional cohort filter
            focus: Optional focus area for pairings
            
        Returns:
            tuple: (success, pairings_list_or_error_message, stats_dict)
        """
        try:
            # Get available students
            query = User.query.filter_by(role="student")
            if cohort:
                query = query.filter_by(cohort=cohort)

            students = query.all()

            if not students:
                return False, "No students available for pairing", {}

            # Shuffle students for random pairing
            shuffled = students.copy()
            random.shuffle(shuffled)

            pairings = []
            used_ids = set()

            for i, student in enumerate(shuffled):
                if student.id in used_ids:
                    continue

                # Find next available partner
                partner = None
                for j in range(i + 1, len(shuffled)):
                    if shuffled[j].id not in used_ids:
                        partner = shuffled[j]
                        break

                if partner:
                    is_valid, _ = PairingService.is_valid_pairing(
                        student.id, partner.id, week
                    )

                    if is_valid:
                        success, pairing = PairingService.create_pairing(
                            student.id,
                            partner.id,
                            week,
                            cohort,
                            focus
                        )

                        if success:
                            pairings.append(pairing)
                            used_ids.add(student.id)
                            used_ids.add(partner.id)

            stats = {
                "total_students": len(students),
                "paired_students": len(used_ids),
                "pairings_created": len(pairings),
                "unpaired_students": len(students) - len(used_ids)
            }

            return True, pairings, stats

        except Exception as e:
            return False, f"Error in auto-pairing: {str(e)}", {}

    @staticmethod
    def get_current_pairing(student_id):
        """
        Get the current pairing for a student.
        
        Args:
            student_id: ID of the student
            
        Returns:
            Pairing object or None
        """
        today = datetime.utcnow().date()
        week_start = today - timedelta(days=today.weekday())

        pairing = Pairing.query.filter(
            and_(
                or_(
                    Pairing.student_id == student_id,
                    Pairing.partner_id == student_id
                ),
                Pairing.week == week_start,
                Pairing.status == "active"
            )
        ).first()

        return pairing

    @staticmethod
    def get_partner(student_id, week=None):
        """
        Get the partner for a student for a given week.
        
        Args:
            student_id: ID of the student
            week: Date of the week (defaults to current week)
            
        Returns:
            User object (partner) or None
        """
        if not week:
            today = datetime.utcnow().date()
            week = today - timedelta(days=today.weekday())

        pairing = Pairing.query.filter(
            and_(
                or_(
                    Pairing.student_id == student_id,
                    Pairing.partner_id == student_id
                ),
                Pairing.week == week,
                Pairing.status == "active"
            )
        ).first()

        if not pairing:
            return None

        if pairing.student_id == student_id:
            return pairing.partner
        else:
            return pairing.student

    @staticmethod
    def update_pairing_status(pairing_id, new_status):
        """
        Update the status of a pairing.
        
        Args:
            pairing_id: ID of the pairing
            new_status: New status (e.g., 'active', 'completed', 'cancelled')
            
        Returns:
            tuple: (success, pairing_or_error_message)
        """
        try:
            pairing = Pairing.query.get(pairing_id)
            if not pairing:
                return False, "Pairing not found"

            pairing.status = new_status
            db.session.commit()
            return True, pairing
        except Exception as e:
            db.session.rollback()
            return False, f"Error updating pairing: {str(e)}"

    @staticmethod
    def get_pairing_history(student_id, limit=10):
        """
        Get pairing history for a student.
        
        Args:
            student_id: ID of the student
            limit: Maximum number of pairings to return
            
        Returns:
            List of Pairing objects
        """
        return Pairing.query.filter(
            or_(
                Pairing.student_id == student_id,
                Pairing.partner_id == student_id
            )
        ).order_by(Pairing.week.desc()).limit(limit).all()

    @staticmethod
    def _notify_pairing(student_id, partner_id, week):
        """
        Send notifications to both students about their pairing.
        
        Args:
            student_id: ID of the student
            partner_id: ID of the partner
            week: Date of the week
        """
        try:
            student = User.query.get(student_id)
            partner = User.query.get(partner_id)

            if not student or not partner:
                return

            # Notify student
            student_notification = Notification(
                recipient_id=student_id,
                title="New Pairing",
                message=f"You have been paired with {partner.name} for the week of {week.strftime('%Y-%m-%d')}",
                notification_type="pairing",
                read=False
            )

            # Notify partner
            partner_notification = Notification(
                recipient_id=partner_id,
                title="New Pairing",
                message=f"You have been paired with {student.name} for the week of {week.strftime('%Y-%m-%d')}",
                notification_type="pairing",
                read=False
            )

            db.session.add(student_notification)
            db.session.add(partner_notification)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Error sending pairing notifications: {str(e)}")
