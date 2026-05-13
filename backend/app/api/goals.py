import logging
from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.schemas.goals import CreateGoalRequest, Goal, UpdateGoalRequest, UpdateGoalStatusRequest
from app.services.goal_service import create_goal, delete_goal, list_goals, update_goal, update_goal_status
from app.core.security import decode_token
from app.core.deps import get_db
from app.exceptions import error_response

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/goals", tags=["goals"])

_bearer = HTTPBearer(auto_error=False)


@router.post("")
def create_goal_endpoint(
    body: CreateGoalRequest,
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

    try:
        create_goal(user_id, body.title, body.description, body.start_date, body.end_date, db)
    except ValueError as e:
        return error_response(str(e))

    return {"success": True}


@router.get("")
def list_goals_endpoint(
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

    goals = list_goals(user_id, db)
    return {
        "goals": [
            Goal(
                goal_id=g.id,
                title=g.title,
                description=g.description,
                start_date=g.start_date.isoformat() if g.start_date else None,
                end_date=g.end_date.isoformat() if g.end_date else None,
                status=g.status,
            )
            for g in goals
        ]
    }


@router.patch("/{goal_id}")
def update_goal_endpoint(
    goal_id: int,
    body: UpdateGoalRequest,
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

    try:
        update_goal(user_id, goal_id, body.model_dump(), body.model_fields_set, db)
    except ValueError as e:
        return error_response(str(e))

    return {"success": True}


@router.delete("/{goal_id}")
def delete_goal_endpoint(
    goal_id: int,
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

    try:
        delete_goal(user_id, goal_id, db)
    except ValueError as e:
        return error_response(str(e))

    return {"success": True}


@router.patch("/{goal_id}/status")
def update_goal_status_endpoint(
    goal_id: int,
    body: UpdateGoalStatusRequest,
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

    try:
        update_goal_status(user_id, goal_id, body.status, db)
    except ValueError as e:
        return error_response(str(e))

    return {"success": True}
