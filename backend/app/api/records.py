import logging
from typing import Optional
from fastapi import APIRouter, Depends, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.services.record_service import create_record, list_records
from app.core.security import decode_token
from app.core.deps import get_db

logger = logging.getLogger(__name__)
router = APIRouter(tags=["records"])

_bearer = HTTPBearer(auto_error=False)


@router.post("/goals/{goal_id}/records")
def create_record_endpoint(
    goal_id: int,
    title: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        create_record(user_id, goal_id, title, content, db)
    except ValueError as e:
        return {"success": False, "error": {"violation_type": str(e)}}

    return {"success": True}


@router.get("/goals/{goal_id}/records")
def list_records_endpoint(
    goal_id: int,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    decode_token(credentials.credentials)

    records = list_records(goal_id, db)
    return {
        "records": [
            {
                "record_id": r.id,
                "title": r.title,
                "content": r.content,
                "entry_date": r.entry_date.isoformat() if r.entry_date else None,
            }
            for r in records
        ]
    }
