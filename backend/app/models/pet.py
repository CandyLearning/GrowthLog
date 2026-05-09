from sqlalchemy import Column, Integer, String, DateTime, Enum as SAEnum, func
from app.models import Base

PET_SPECIES = (
    "capybara", "dog", "cat", "snake", "rabbit",
    "hamster", "panda", "penguin", "fox", "dragon",
)


class Pet(Base):
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False, unique=True)
    pet_name = Column(String, nullable=False)
    species = Column(SAEnum(*PET_SPECIES, name="pet_species"), nullable=False)
    happiness = Column(Integer, nullable=False, default=100)
    fullness = Column(Integer, nullable=False, default=100)
    level = Column(Integer, nullable=False, default=1)
    created_by = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_by = Column(Integer, nullable=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)
