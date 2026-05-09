from sqlalchemy import Column, Integer, String, Text, Date, DateTime, func
from app.models import Base


class LearningRecord(Base):
    __tablename__ = "learning_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    goal_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    image_path = Column(String, nullable=True)
    entry_date = Column(Date, nullable=False)
    created_by = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(Integer, nullable=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)
