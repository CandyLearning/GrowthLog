from sqlalchemy import Column, Integer, Text, Date, DateTime, func
from app.models import Base


class GratitudeEntry(Base):
    __tablename__ = "gratitude_entries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    entry_date = Column(Date, nullable=False)
    created_by = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(Integer, nullable=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)
