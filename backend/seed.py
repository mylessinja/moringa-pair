"""Load sample data for admin + mentor pages."""
from datetime import date, datetime, timezone, timedelta

from app import create_app
from models import (
    db,
    User,
    MentorProfile,
    MentorExpertise,
    Cohort,
    CohortMember,
    Pairing,
    Setting,
)


def seed():
    app = create_app()
    with app.app_context():
        # Wipe existing rows (dev only)
        db.drop_all()
        db.create_all()

        # ── Admin ──────────────────────────────────────────
        admin = User(
            name="System Admin",
            email="admin@moringapair.com",
            role="admin",
            status="active",
            last_active_at=datetime.now(timezone.utc),
        )
        admin.set_password("admin123")

        # ── Mentors ────────────────────────────────────────
        albert = User(
            name="Albert Byrone",
            email="a.byrone@moringapair.com",
            role="mentor",
            status="active",
            last_active_at=datetime.now(timezone.utc) - timedelta(hours=1),
        )
        albert.set_password("mentor123")

        caleb = User(
            name="Caleb Kiprotich",
            email="c.kiprotich@moringapair.com",
            role="mentor",
            status="active",
            last_active_at=datetime.now(timezone.utc) - timedelta(days=1),
        )
        caleb.set_password("mentor123")

        david = User(
            name="David Omondi",
            email="d.omondi@moringapair.com",
            role="mentor",
            status="active",
            last_active_at=datetime.now(timezone.utc) - timedelta(hours=3),
        )
        david.set_password("mentor123")

        mercy = User(
            name="Mercy Nzau",
            email="m.nzau@moringapair.com",
            role="mentor",
            status="suspended",
            last_active_at=datetime.now(timezone.utc) - timedelta(days=14),
        )
        mercy.set_password("mentor123")

        # ── Students ───────────────────────────────────────
        victor = User(
            name="Victor SInja",
            email="v.sinja@moringapair.com",
            role="student",
            status="active",
            last_active_at=datetime.now(timezone.utc) - timedelta(hours=2),
        )
        victor.set_password("student123")

        ariel = User(
            name="Ariel Muhuri",
            email="a.muhuri@moringapair.com",
            role="student",
            status="active",
            last_active_at=datetime.now(timezone.utc) - timedelta(days=1),
        )
        ariel.set_password("student123")

        charity = User(
            name="Charity Kiharu",
            email="c.kiharu@moringapair.com",
            role="student",
            status="active",
            last_active_at=datetime.now(timezone.utc),
        )
        charity.set_password("student123")

        db.session.add_all(
            [admin, albert, caleb, david, mercy, victor, ariel, charity]
        )
        db.session.flush()  # get IDs

        # ── Mentor profiles ────────────────────────────────
        db.session.add_all(
            [
                MentorProfile(user_id=albert.id, status="approved", bio="Full-stack lead"),
                MentorProfile(user_id=caleb.id, status="pending", bio="UX mentor"),
                MentorProfile(user_id=david.id, status="approved", bio="Data science"),
                MentorProfile(user_id=mercy.id, status="suspended", bio="DevOps"),
            ]
        )

        # ── Expertise ──────────────────────────────────────
        expertise_map = {
            albert.id: ["React", "Node.js"],
            caleb.id: ["UX Research", "Figma"],
            david.id: ["Python", "Machine Learning"],
            mercy.id: ["DevOps"],
        }
        for mentor_id, skills in expertise_map.items():
            for skill in skills:
                db.session.add(MentorExpertise(mentor_id=mentor_id, skill=skill))

        # ── Cohorts ────────────────────────────────────────
        se34 = Cohort(
            name="SE-Cohort 34",
            track="Software Engineering",
            status="active",
            week_of_syllabus=6,
            total_weeks=12,
            lead_mentor_id=albert.id,
        )
        se35 = Cohort(
            name="SE-Cohort 35",
            track="Software Engineering",
            status="active",
            week_of_syllabus=3,
            total_weeks=12,
            lead_mentor_id=albert.id,
        )
        ds12 = Cohort(
            name="DS-Cohort 12",
            track="Data Science",
            status="active",
            week_of_syllabus=10,
            total_weeks=12,
            lead_mentor_id=david.id,
        )
        db.session.add_all([se34, se35, ds12])
        db.session.flush()

        # ── Cohort members ─────────────────────────────────
        members = [
            # mentors on cohorts
            CohortMember(cohort_id=se34.id, user_id=albert.id, member_role="mentor"),
            CohortMember(cohort_id=se35.id, user_id=albert.id, member_role="mentor"),
            CohortMember(cohort_id=ds12.id, user_id=david.id, member_role="mentor"),
            # students
            CohortMember(cohort_id=se34.id, user_id=victor.id, member_role="student", mastery=85),
            CohortMember(cohort_id=se35.id, user_id=ariel.id, member_role="student", mastery=60),
            CohortMember(cohort_id=ds12.id, user_id=charity.id, member_role="student", mastery=90),
        ]
        db.session.add_all(members)

        # ── Sample pairing (this week) ─────────────────────
        week_start = date.today() - timedelta(days=date.today().weekday())
        # only 1 student in se34 for now — skip real pair; leave table ready
        # add a second student later for real pairs

        # ── Settings ───────────────────────────────────────
        db.session.add_all(
            [
                Setting(key="pairing_strategy", value="balanced"),
                Setting(key="avoid_repeat_weeks", value="3"),
                Setting(key="auto_weekly_pairing", value="true"),
                Setting(key="platform_name", value="MoringaPair"),
            ]
        )

        db.session.commit()

        print(" Seed complete")
        print("── Logins ──────────────────────────")
        print("  admin@moringapair.com   / admin123")
        print("  a.byrone@moringapair.com / mentor123")
        print("  v.sinja@moringapair.com  / student123")
        print("── Counts ──────────────────────────")
        print(f"  users:    {User.query.count()}")
        print(f"  cohorts:  {Cohort.query.count()}")
        print(f"  members:  {CohortMember.query.count()}")
        print(f"  mentors:  {MentorProfile.query.count()}")


if __name__ == "__main__":
    seed()
