import logging
from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.schemas.users import UpdateUserProfileRequest
from app.services.user_service import update_user_profile
from app.repositories.user_repository import UserRepository
from app.core.security import decode_token
from app.core.deps import get_db
from app.exceptions import error_response

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/users", tags=["users"])

_bearer = HTTPBearer(auto_error=False)


@router.get("/me")
def get_profile(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return error_response("UNAUTHORIZED")
    try:
        payload = decode_token(credentials.credentials)
    except ValueError as e:
        return error_response(str(e))
    user_id = payload["user_id"]
    repo = UserRepository(db)
    user = repo.find_by_id(user_id)
    if user is None:
        return error_response("NOT_FOUND")
    return {
        "user_id": user.id,
        "display_name": user.display_name,
        "avatar_url": user.avatar_url,
    }


@router.patch("/me")
def update_profile(
    body: UpdateUserProfileRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return error_response("UNAUTHORIZED")
    try:
        payload = decode_token(credentials.credentials)
    except ValueError as e:
        return error_response(str(e))
    user_id = payload["user_id"]
    update_user_profile(user_id, body.display_name, body.avatar_url, db)
    return {"success": True}
