import logging
from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.schemas.gratitude import CreateGratitudeRequest, UpdateGratitudeRequest
from app.services.gratitude_service import create_gratitude, list_gratitude, update_gratitude, delete_gratitude
from app.core.security import decode_token
from app.core.deps import get_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/gratitude", tags=["gratitude"])

_bearer = HTTPBearer(auto_error=False)


@router.post("")
def create_gratitude_endpoint(
    body: CreateGratitudeRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        create_gratitude(user_id, body.content, db)
    except ValueError as e:
        return {"success": False, "error": {"violation_type": str(e)}}

    return {"success": True}


@router.get("")
def list_gratitude_endpoint(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]
    entries = list_gratitude(user_id, db)
    return {
        "entries": [
            {
                "entry_id": e.id,
                "content": e.content,
                "entry_date": e.entry_date.isoformat() if e.entry_date else None,
            }
            for e in entries
        ]
    }


@router.patch("/{entry_id}")
def update_gratitude_endpoint(
    entry_id: int,
    body: UpdateGratitudeRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        update_gratitude(user_id, entry_id, body.content, db)
    except ValueError as e:
        return {"success": False, "error": {"violation_type": str(e)}}

    return {"success": True}


@router.delete("/{entry_id}")
def delete_gratitude_endpoint(
    entry_id: int,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        delete_gratitude(user_id, entry_id, db)
    except ValueError as e:
        return {"success": False, "error": {"violation_type": str(e)}}

    return {"success": True}
