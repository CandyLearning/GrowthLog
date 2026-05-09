from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Enum as SAEnum, func
from app.models import Base

GOAL_STATUS = ("not_started", "in_progress", "completed", "abandoned")


class LearningGoal(Base):
    __tablename__ = "learning_goals"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    status = Column(
        SAEnum(*GOAL_STATUS, name="goal_status"),
        nullable=False,
        default="not_started",
    )
    created_by = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(Integer, nullable=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)
