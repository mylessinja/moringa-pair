"""Add pairings and notifications tables

Revision ID: 3f2a1c8e7b41
Revises: 9dcb4dd7d320
"""
from alembic import op
import sqlalchemy as sa


revision = "3f2a1c8e7b41"
down_revision = "9dcb4dd7d320"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "pairings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column("partner_id", sa.Integer(), nullable=False),
        sa.Column("week", sa.Date(), nullable=False),
        sa.Column("cohort", sa.String(length=100), nullable=True),
        sa.Column("focus", sa.String(length=150), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["partner_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["student_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_pairings_student_id", "pairings", ["student_id"])
    op.create_index("ix_pairings_partner_id", "pairings", ["partner_id"])
    op.create_index("ix_pairings_week", "pairings", ["week"])

    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("recipient_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=150), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("notification_type", sa.String(length=50), nullable=False),
        sa.Column("read", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["recipient_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_notifications_recipient_id", "notifications", ["recipient_id"])
    op.create_index("ix_notifications_created_at", "notifications", ["created_at"])


def downgrade():
    op.drop_index("ix_notifications_created_at", table_name="notifications")
    op.drop_index("ix_notifications_recipient_id", table_name="notifications")
    op.drop_table("notifications")
    op.drop_index("ix_pairings_week", table_name="pairings")
    op.drop_index("ix_pairings_partner_id", table_name="pairings")
    op.drop_index("ix_pairings_student_id", table_name="pairings")
    op.drop_table("pairings")