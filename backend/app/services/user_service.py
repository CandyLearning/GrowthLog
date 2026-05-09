import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository

logger = logging.getLogger(__name__)


def update_user_profile(
    user_id: int,
    display_name: Optional[str],
    avatar_url: Optional[str],
    db: Session,
) -> None:
    repo = UserRepository(db)
    user = repo.find_by_id(user_id)
    if display_name is not None:
        user.display_name = display_name
    if avatar_url is not None:
        user.avatar_url = avatar_url
    db.commit()
    logger.info("User profile updated: user_id=%s", user_id)
