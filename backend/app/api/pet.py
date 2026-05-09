import logging
from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.schemas.pet import CreatePetRequest
from app.services.pet_service import create_pet, get_pet, feed_pet, interact_with_pet
from app.core.security import decode_token
from app.core.deps import get_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/pet", tags=["pet"])

_bearer = HTTPBearer(auto_error=False)


@router.post("")
def create_pet_endpoint(
    body: CreatePetRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        create_pet(user_id, body.species, body.pet_name, db)
    except ValueError as e:
        return {"success": False, "error": {"violation_type": str(e)}}

    pet = get_pet(user_id, db)
    return {
        "success": True,
        "pet": {
            "species": pet.species,
            "pet_name": pet.pet_name,
            "happiness": pet.happiness,
            "fullness": pet.fullness,
            "level": pet.level,
        },
    }


@router.get("")
def get_pet_endpoint(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        pet = get_pet(user_id, db)
    except ValueError as e:
        return {"success": False, "error": {"violation_type": str(e)}}

    return {
        "pet": {
            "species": pet.species,
            "pet_name": pet.pet_name,
            "happiness": pet.happiness,
            "fullness": pet.fullness,
            "level": pet.level,
        }
    }


@router.post("/feed")
def feed_pet_endpoint(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        pet = feed_pet(user_id, db)
    except ValueError as e:
        return {"success": False, "error": {"violation_type": str(e)}}

    return {
        "success": True,
        "pet": {
            "species": pet.species,
            "pet_name": pet.pet_name,
            "happiness": pet.happiness,
            "fullness": pet.fullness,
            "level": pet.level,
        },
    }


@router.post("/interact")
def interact_pet_endpoint(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return {"success": False, "error": {"violation_type": "UNAUTHORIZED"}}
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        pet = interact_with_pet(user_id, db)
    except ValueError as e:
        return {"success": False, "error": {"violation_type": str(e)}}

    return {
        "success": True,
        "pet": {
            "species": pet.species,
            "pet_name": pet.pet_name,
            "happiness": pet.happiness,
            "fullness": pet.fullness,
            "level": pet.level,
        },
    }
