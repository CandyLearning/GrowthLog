from sqlalchemy import Column, Integer, String, DateTime, func
from app.models import Base


class MoodTag(Base):
    __tablename__ = "mood_tags"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    tag_name = Column(String, nullable=False)
    created_by = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(Integer, nullable=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)
