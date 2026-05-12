import logging
import os
import shutil
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.services.record_service import create_record, list_records, update_record, delete_record
from app.schemas.records import UpdateRecordRequest
from app.core.security import decode_token
from app.core.deps import get_db
from app.exceptions import error_response

logger = logging.getLogger(__name__)
router = APIRouter(tags=["records"])

_bearer = HTTPBearer(auto_error=False)

RECORD_UPLOAD_DIR = "uploads/records"


@router.post("/goals/{goal_id}/records")
def create_record_endpoint(
    goal_id: int,
    title: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return error_response("UNAUTHORIZED")
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    image_url = None
    if image and image.filename:
        os.makedirs(RECORD_UPLOAD_DIR, exist_ok=True)
        ext = os.path.splitext(image.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        save_path = os.path.join(RECORD_UPLOAD_DIR, filename)
        with open(save_path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_url = f"/uploads/records/{filename}"

    try:
        create_record(user_id, goal_id, title, content, image_url, db)
    except ValueError as e:
        return error_response(str(e))

    return {"success": True}


@router.get("/goals/{goal_id}/records")
def list_records_endpoint(
    goal_id: int,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return error_response("UNAUTHORIZED")
    decode_token(credentials.credentials)

    records = list_records(goal_id, db)
    return {
        "records": [
            {
                "record_id": r.id,
                "title": r.title,
                "content": r.content,
                "image_url": r.image_path,
                "entry_date": r.entry_date.isoformat() if r.entry_date else None,
            }
            for r in records
        ]
    }


@router.patch("/goals/{goal_id}/records/{record_id}")
def update_record_endpoint(
    goal_id: int,
    record_id: int,
    body: UpdateRecordRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return error_response("UNAUTHORIZED")
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        update_record(user_id, goal_id, record_id, body.title, body.content, db)
    except ValueError as e:
        return error_response(str(e))

    return {"success": True}


@router.delete("/goals/{goal_id}/records/{record_id}")
def delete_record_endpoint(
    goal_id: int,
    record_id: int,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return error_response("UNAUTHORIZED")
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        delete_record(user_id, goal_id, record_id, db)
    except ValueError as e:
        return error_response(str(e))

    return {"success": True}
