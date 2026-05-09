"""create pets table

Revision ID: 006
Revises: 005
Create Date: 2026-05-09
"""
from alembic import op
import sqlalchemy as sa

revision = "006"
down_revision = "005"
branch_labels = None
depends_on = None

_PET_SPECIES = ("capybara", "dog", "cat", "snake", "rabbit", "hamster", "panda", "penguin", "fox", "dragon")


def upgrade() -> None:
    op.create_table(
        "pets",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("pet_name", sa.String(), nullable=False),
        sa.Column(
            "species",
            sa.Enum(*_PET_SPECIES, name="pet_species"),
            nullable=False,
        ),
        sa.Column("happiness", sa.Integer(), nullable=False, server_default="100"),
        sa.Column("fullness", sa.Integer(), nullable=False, server_default="100"),
        sa.Column("level", sa.Integer(), nullable=False, server_default="1"),
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
        sa.UniqueConstraint("user_id", name="uq_pets_user_id"),
    )


def downgrade() -> None:
    op.drop_table("pets")
    op.execute("DROP TYPE pet_species")
