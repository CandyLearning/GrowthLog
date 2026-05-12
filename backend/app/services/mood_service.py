import logging
from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.mood_entry import MoodEntry, MOOD_TYPES
from app.repositories.mood_entry_repository import MoodEntryRepository

logger = logging.getLogger(__name__)

_VALID_MOOD_TYPES = set(MOOD_TYPES)


def create_mood(
    user_id: int,
    mood_type: Optional[str],
    note: Optional[str],
    tag_ids: Optional[List[int]],
    db: Session,
) -> None:
    if not mood_type:
        raise ValueError("MISSING_REQUIRED_FIELD")
    if mood_type not in _VALID_MOOD_TYPES:
        raise ValueError("INVALID_VALUE")

    repo = MoodEntryRepository(db)
    entry = MoodEntry(
        user_id=user_id,
        mood_type=mood_type,
        note=note or None,
        entry_date=date.today(),
        created_by=0,
    )
    repo.create(entry, tag_ids or [])
    logger.info("Mood created: user_id=%s, mood_type=%s", user_id, mood_type)

    from app.services.pet_service import update_pet_happiness
    update_pet_happiness(user_id, 3, db)


def list_moods(user_id: int, db: Session) -> List[MoodEntry]:
    repo = MoodEntryRepository(db)
    return repo.find_all_by_user(user_id)


def update_mood(
    user_id: int,
    entry_id: int,
    mood_type: Optional[str],
    note: Optional[str],
    db: Session,
) -> None:
    if not mood_type:
        raise ValueError("MISSING_REQUIRED_FIELD")
    if mood_type not in _VALID_MOOD_TYPES:
        raise ValueError("INVALID_VALUE")

    repo = MoodEntryRepository(db)
    entry = repo.find_by_id(entry_id)
    if entry is None:
        raise ValueError("NOT_FOUND")
    if entry.user_id != user_id:
        raise ValueError("FORBIDDEN")

    entry.mood_type = mood_type
    entry.note = note or None
    entry.updated_by = user_id
    db.commit()
    logger.info("Mood updated: entry_id=%s user_id=%s", entry_id, user_id)


def delete_mood(user_id: int, entry_id: int, db: Session) -> None:
    repo = MoodEntryRepository(db)
    entry = repo.find_by_id(entry_id)
    if entry is None:
        raise ValueError("NOT_FOUND")
    if entry.user_id != user_id:
        raise ValueError("FORBIDDEN")

    repo.delete(entry)
    logger.info("Mood deleted: entry_id=%s user_id=%s", entry_id, user_id)
