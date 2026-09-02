"""Dev seed: enough students for pairing + mentor demos."""
from datetime import date, datetime, timezone, timedelta

from app import create_app
from models import (
    db,
    User,
    MentorProfile,
    MentorExpertise,
    Cohort,
    CohortMember,
    Setting,
)

# Optional models — ignore if not registered yet
try:
    from models import Feedback, Pairing, Notification
except ImportError:
    Feedback = Pairing = Notification = None


def seed():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()

        admin = User(name="System Admin", email="admin@moringapair.com", role="admin", status="active",
                     last_active_at=datetime.now(timezone.utc))
        admin.set_password("admin123")

        albert = User(name="Albert Byrone", email="a.byrone@moringapair.com", role="mentor", status="active",
                      last_active_at=datetime.now(timezone.utc) - timedelta(hours=1))
        albert.set_password("mentor123")
        caleb = User(name="Caleb Kiprotich", email="c.kiprotich@moringapair.com", role="mentor", status="active")
        caleb.set_password("mentor123")
        david = User(name="David Omondi", email="d.omondi@moringapair.com", role="mentor", status="active")
        david.set_password("mentor123")
        mercy = User(name="Mercy Nzau", email="m.nzau@moringapair.com", role="mentor", status="suspended")
        mercy.set_password("mentor123")

        students_data = [
            ("Victor SInja", "v.sinja@moringapair.com", 85),
            ("Ariel Muhuri", "a.muhuri@moringapair.com", 60),
            ("Charity Kiharu", "c.kiharu@moringapair.com", 90),
            ("Brian Otieno", "b.otieno@moringapair.com", 62),
            ("Faith Chebet", "f.chebet@moringapair.com", 91),
            ("Diana Wanjiku", "d.wanjiku@moringapair.com", 74),
            ("Kevin Mwangi", "k.mwangi@moringapair.com", 55),
            ("Grace Achieng", "g.achieng@moringapair.com", 88),
        ]
        students = []
        for name, email, _ in students_data:
            u = User(name=name, email=email, role="student", status="active",
                     last_active_at=datetime.now(timezone.utc) - timedelta(hours=2))
            u.set_password("student123")
            students.append(u)

        db.session.add_all([admin, albert, caleb, david, mercy, *students])
        db.session.flush()

        db.session.add_all([
            MentorProfile(user_id=albert.id, status="approved", bio="Full-stack lead"),
            MentorProfile(user_id=caleb.id, status="pending", bio="UX mentor"),
            MentorProfile(user_id=david.id, status="approved", bio="Data science"),
            MentorProfile(user_id=mercy.id, status="suspended", bio="DevOps"),
        ])
        for mid, skills in {
            albert.id: ["React", "Node.js"],
            caleb.id: ["UX Research", "Figma"],
            david.id: ["Python", "Machine Learning"],
            mercy.id: ["DevOps"],
        }.items():
            for s in skills:
                db.session.add(MentorExpertise(mentor_id=mid, skill=s))

        se34 = Cohort(name="SE-Cohort 34", track="Software Engineering", status="active",
                      week_of_syllabus=6, total_weeks=12, lead_mentor_id=albert.id)
        se35 = Cohort(name="SE-Cohort 35", track="Software Engineering", status="active",
                      week_of_syllabus=3, total_weeks=12, lead_mentor_id=albert.id)
        ds12 = Cohort(name="DS-Cohort 12", track="Data Science", status="active",
                      week_of_syllabus=10, total_weeks=12, lead_mentor_id=david.id)
        db.session.add_all([se34, se35, ds12])
        db.session.flush()

        # mastery by email
        mastery = {email: m for _, email, m in students_data}
        by_email = {u.email: u for u in students}

        # SE-34: 4 students (pairing works)
        for email in ["v.sinja@moringapair.com", "b.otieno@moringapair.com",
                      "d.wanjiku@moringapair.com", "k.mwangi@moringapair.com"]:
            u = by_email[email]
            db.session.add(CohortMember(
                cohort_id=se34.id, user_id=u.id, member_role="student", mastery=mastery[email]))
        db.session.add(CohortMember(cohort_id=se34.id, user_id=albert.id, member_role="mentor"))

        # SE-35: 2 students
        for email in ["a.muhuri@moringapair.com", "f.chebet@moringapair.com"]:
            u = by_email[email]
            db.session.add(CohortMember(
                cohort_id=se35.id, user_id=u.id, member_role="student", mastery=mastery[email]))
        db.session.add(CohortMember(cohort_id=se35.id, user_id=albert.id, member_role="mentor"))

        # DS-12: 2 students
        for email in ["c.kiharu@moringapair.com", "g.achieng@moringapair.com"]:
            u = by_email[email]
            db.session.add(CohortMember(
                cohort_id=ds12.id, user_id=u.id, member_role="student", mastery=mastery[email]))
        db.session.add(CohortMember(cohort_id=ds12.id, user_id=david.id, member_role="mentor"))

        db.session.add_all([
            Setting(key="pairing_strategy", value="balanced"),
            Setting(key="avoid_repeat_weeks", value="3"),
            Setting(key="auto_weekly_pairing", value="true"),
            Setting(key="platform_name", value="MoringaPair"),
        ])

        if Feedback is not None:
            db.session.add(Feedback(
                mentor_id=albert.id,
                student_id=by_email["v.sinja@moringapair.com"].id,
                session_type="Code review",
                note="Strong on React hooks. Practice custom hooks next.",
            ))

        db.session.commit()
        print("✅ Seed complete")
        print("  admin@moringapair.com     / admin123")
        print("  a.byrone@moringapair.com  / mentor123")
        print("  v.sinja@moringapair.com   / student123")
        print(f"  users={User.query.count()} cohorts={Cohort.query.count()} members={CohortMember.query.count()}")


if __name__ == "__main__":
    seed()
