import logging
from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.learning_record import LearningRecord
from app.repositories.learning_goal_repository import LearningGoalRepository
from app.repositories.learning_record_repository import LearningRecordRepository

logger = logging.getLogger(__name__)


def create_record(
    user_id: int,
    goal_id: int,
    title: Optional[str],
    content: Optional[str],
    db: Session,
) -> None:
    if not title:
        raise ValueError("MISSING_REQUIRED_FIELD")

    goal_repo = LearningGoalRepository(db)
    if goal_repo.find_by_id(goal_id) is None:
        raise ValueError("NOT_FOUND")

    record_repo = LearningRecordRepository(db)
    record = LearningRecord(
        goal_id=goal_id,
        user_id=user_id,
        title=title,
        content=content or None,
        entry_date=date.today(),
        created_by=0,
    )
    record_repo.create(record)
    logger.info("Record created: user_id=%s, goal_id=%s, title=%s", user_id, goal_id, title)

    from app.services.pet_service import update_pet_happiness
    update_pet_happiness(user_id, 10, db)


def list_records(goal_id: int, db: Session) -> List[LearningRecord]:
    repo = LearningRecordRepository(db)
    return repo.find_all_by_goal(goal_id)
