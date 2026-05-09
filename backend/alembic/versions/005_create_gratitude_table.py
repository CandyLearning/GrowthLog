"""create gratitude_entries table

Revision ID: 005
Revises: 004
Create Date: 2026-05-09
"""
from alembic import op
import sqlalchemy as sa

revision = "005"
down_revision = "004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "gratitude_entries",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
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
    op.create_index("idx_gratitude_entries_user_id", "gratitude_entries", ["user_id"])
    op.create_index("idx_gratitude_entries_entry_date", "gratitude_entries", ["entry_date"])


def downgrade() -> None:
    op.drop_index("idx_gratitude_entries_entry_date", "gratitude_entries")
    op.drop_index("idx_gratitude_entries_user_id", "gratitude_entries")
    op.drop_table("gratitude_entries")
