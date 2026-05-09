from sqlalchemy import Column, Integer, Text, Date, DateTime, Enum as SAEnum, func
from app.models import Base

MOOD_TYPES = ("depressed", "sad", "unhappy", "neutral", "good", "happy")


class MoodEntry(Base):
    __tablename__ = "mood_entries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    mood_type = Column(SAEnum(*MOOD_TYPES, name="mood_type"), nullable=False)
    note = Column(Text, nullable=True)
    entry_date = Column(Date, nullable=False)
    created_by = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(Integer, nullable=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)
