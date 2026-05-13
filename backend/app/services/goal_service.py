import logging
from datetime import date
from typing import List, Optional, Set
from sqlalchemy.orm import Session
from app.models.learning_goal import LearningGoal
from app.repositories.learning_goal_repository import LearningGoalRepository
from app.repositories.learning_record_repository import LearningRecordRepository

logger = logging.getLogger(__name__)


def create_goal(
    user_id: int,
    title: Optional[str],
    description: Optional[str],
    start_date: Optional[str],
    end_date: Optional[str],
    db: Session,
) -> None:
    if not title:
        raise ValueError("MISSING_REQUIRED_FIELD")

    repo = LearningGoalRepository(db)
    goal = LearningGoal(
        user_id=user_id,
        title=title,
        description=description or None,
        start_date=date.fromisoformat(start_date) if start_date else None,
        end_date=date.fromisoformat(end_date) if end_date else None,
        status="not_started",
        created_by=0,
    )
    repo.create(goal)
    logger.info("Goal created: user_id=%s, title=%s", user_id, title)


def list_goals(user_id: int, db: Session) -> List[LearningGoal]:
    repo = LearningGoalRepository(db)
    return repo.find_all_by_user(user_id)


_VALID_TRANSITIONS = {
    "not_started": ["in_progress"],
    "in_progress": ["completed", "abandoned"],
    "abandoned": ["in_progress"],
    "completed": [],
}


def update_goal(
    user_id: int,
    goal_id: int,
    fields: dict,
    fields_set: Set[str],
    db: Session,
) -> None:
    repo = LearningGoalRepository(db)
    goal = repo.find_by_id(goal_id)

    if goal is None:
        raise ValueError("NOT_FOUND")
    if goal.user_id != user_id:
        raise ValueError("FORBIDDEN")

    if "title" in fields_set:
        if not fields.get("title"):
            raise ValueError("MISSING_REQUIRED_FIELD")
        goal.title = fields["title"]

    if "description" in fields_set:
        goal.description = fields.get("description")

    if "start_date" in fields_set:
        raw = fields.get("start_date")
        goal.start_date = date.fromisoformat(raw) if raw else None

    if "end_date" in fields_set:
        raw = fields.get("end_date")
        goal.end_date = date.fromisoformat(raw) if raw else None

    db.commit()
    logger.info("Goal updated: goal_id=%s", goal_id)


def delete_goal(user_id: int, goal_id: int, db: Session) -> None:
    repo = LearningGoalRepository(db)
    goal = repo.find_by_id(goal_id)

    if goal is None:
        raise ValueError("NOT_FOUND")
    if goal.user_id != user_id:
        raise ValueError("FORBIDDEN")

    LearningRecordRepository(db).delete_all_by_goal(goal_id)
    repo.delete(goal)
    logger.info("Goal deleted: goal_id=%s", goal_id)


def update_goal_status(user_id: int, goal_id: int, new_status: str, db: Session) -> None:
    repo = LearningGoalRepository(db)
    goal = repo.find_by_id(goal_id)

    if goal is None:
        raise ValueError("NOT_FOUND")
    if goal.user_id != user_id:
        raise ValueError("FORBIDDEN")
    if new_status not in _VALID_TRANSITIONS.get(goal.status, []):
        raise ValueError("INVALID_STATUS_TRANSITION")

    goal.status = new_status
    db.commit()
    logger.info("Goal status updated: goal_id=%s, status=%s", goal_id, new_status)
