import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.core.security import create_token

logger = logging.getLogger(__name__)


def google_login(
    google_id: str,
    display_name: str,
    avatar_url: Optional[str],
    db: Session,
) -> str:
    repo = UserRepository(db)
    user = repo.find_by_google_id(google_id)
    if user is None:
        user = repo.create(User(
            google_id=google_id,
            display_name=display_name,
            avatar_url=avatar_url,
            created_by=0,
        ))
        logger.info("User created: google_id=%s", google_id)
    return create_token(user.id)
