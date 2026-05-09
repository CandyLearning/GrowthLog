import logging
from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.gratitude_entry import GratitudeEntry
from app.repositories.gratitude_entry_repository import GratitudeEntryRepository

logger = logging.getLogger(__name__)


def create_gratitude(user_id: int, content: Optional[str], db: Session) -> None:
    if not content or not content.strip():
        raise ValueError("MISSING_REQUIRED_FIELD")

    repo = GratitudeEntryRepository(db)
    entry = GratitudeEntry(
        user_id=user_id,
        content=content,
        entry_date=date.today(),
        created_by=0,
    )
    repo.create(entry)
    logger.info("Gratitude entry created: user_id=%s", user_id)

    from app.services.pet_service import update_pet_happiness
    update_pet_happiness(user_id, 8, db)


def list_gratitude(user_id: int, db: Session) -> List[GratitudeEntry]:
    repo = GratitudeEntryRepository(db)
    return repo.find_all_by_user(user_id)


def update_gratitude(user_id: int, entry_id: int, content: Optional[str], db: Session) -> None:
    if not content or not content.strip():
        raise ValueError("MISSING_REQUIRED_FIELD")

    repo = GratitudeEntryRepository(db)
    entry = repo.find_by_id(entry_id)
    if entry is None:
        raise ValueError("NOT_FOUND")
    if entry.user_id != user_id:
        raise ValueError("UNAUTHORIZED")

    entry.content = content
    entry.updated_by = user_id
    db.commit()
    logger.info("Gratitude entry updated: entry_id=%s user_id=%s", entry_id, user_id)


def delete_gratitude(user_id: int, entry_id: int, db: Session) -> None:
    repo = GratitudeEntryRepository(db)
    entry = repo.find_by_id(entry_id)
    if entry is None:
        raise ValueError("NOT_FOUND")
    if entry.user_id != user_id:
        raise ValueError("UNAUTHORIZED")

    repo.delete(entry)
    logger.info("Gratitude entry deleted: entry_id=%s user_id=%s", entry_id, user_id)
