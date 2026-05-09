import logging
from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.schemas.users import UpdateUserProfileRequest
from app.services.user_service import update_user_profile
from app.core.security import decode_token
from app.core.deps import get_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/users", tags=["users"])

_bearer = HTTPBearer(auto_error=False)


@router.get("/me")
def get_profile(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    return {}


@router.patch("/me")
def update_profile(
    body: UpdateUserProfileRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]
    update_user_profile(user_id, body.display_name, body.avatar_url, db)
    return {"success": True}
