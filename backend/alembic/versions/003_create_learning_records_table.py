"""create learning_records table

Revision ID: 003
Revises: 002
Create Date: 2026-05-08
"""
from alembic import op
import sqlalchemy as sa

revision = "003"
down_revision = "002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "learning_records",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("goal_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("image_path", sa.String(), nullable=True),
        sa.Column("entry_date", sa.Date(), nullable=False),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column("updated_by", sa.Integer(), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_learning_records_goal_id", "learning_records", ["goal_id"])
    op.create_index("idx_learning_records_user_id", "learning_records", ["user_id"])


def downgrade() -> None:
    op.drop_index("idx_learning_records_user_id", "learning_records")
    op.drop_index("idx_learning_records_goal_id", "learning_records")
    op.drop_table("learning_records")
