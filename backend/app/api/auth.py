import logging
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.auth import GoogleAuthRequest
from app.services.auth_service import google_login
from app.core.deps import get_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/google")
def google_oauth_callback(body: GoogleAuthRequest, db: Session = Depends(get_db)):
    token = google_login(
        google_id=body.google_id,
        display_name=body.display_name,
        avatar_url=body.avatar_url,
        db=db,
    )
    return {"token": token}
