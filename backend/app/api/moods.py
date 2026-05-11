import logging
from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.schemas.moods import CreateMoodRequest, UpdateMoodRequest
from app.services.mood_service import create_mood, list_moods, update_mood, delete_mood
from app.core.security import decode_token
from app.core.deps import get_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/moods", tags=["moods"])

_bearer = HTTPBearer(auto_error=False)


@router.post("")
def create_mood_endpoint(
    body: CreateMoodRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        create_mood(user_id, body.mood_type, body.note, body.tag_ids, db)
    except ValueError as e:
        return {"success": False, "error": {"violation_type": str(e)}}

    return {"success": True}


@router.get("")
def list_moods_endpoint(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]
    entries = list_moods(user_id, db)
    return {
        "entries": [
            {
                "entry_id": e.id,
                "mood_type": e.mood_type,
                "note": e.note,
                "entry_date": e.entry_date.isoformat() if e.entry_date else None,
            }
            for e in entries
        ]
    }


@router.patch("/{entry_id}")
def update_mood_endpoint(
    entry_id: int,
    body: UpdateMoodRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        update_mood(user_id, entry_id, body.mood_type, body.note, db)
    except ValueError as e:
        return {"success": False, "error": {"violation_type": str(e)}}

    return {"success": True}


@router.delete("/{entry_id}")
def delete_mood_endpoint(
    entry_id: int,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        delete_mood(user_id, entry_id, db)
    except ValueError as e:
        return {"success": False, "error": {"violation_type": str(e)}}

    return {"success": True}
