from sqlalchemy import Column, Integer
from app.models import Base


class MoodEntryTag(Base):
    __tablename__ = "mood_entry_tags"

    mood_entry_id = Column(Integer, primary_key=True)
    tag_id = Column(Integer, primary_key=True)
