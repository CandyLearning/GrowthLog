import logging
from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.schemas.pet import CreatePetRequest, RenamePetRequest
from app.services.pet_service import create_pet, get_pet, feed_pet, interact_with_pet, rename_pet
from app.core.security import decode_token
from app.core.deps import get_db
from app.exceptions import error_response

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/pet", tags=["pet"])

_bearer = HTTPBearer(auto_error=False)


def _pet_dict(pet) -> dict:
    return {
        "species": pet.species,
        "pet_name": pet.pet_name,
        "happiness": pet.happiness,
        "fullness": pet.fullness,
        "level": pet.level,
    }


@router.post("")
def create_pet_endpoint(
    body: CreatePetRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return error_response("UNAUTHORIZED")
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        create_pet(user_id, body.species, body.pet_name, db)
    except ValueError as e:
        return error_response(str(e))

    pet = get_pet(user_id, db)
    return {"success": True, "pet": _pet_dict(pet)}


@router.get("")
def get_pet_endpoint(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return error_response("UNAUTHORIZED")
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        pet = get_pet(user_id, db)
    except ValueError as e:
        return error_response(str(e))

    return {"pet": _pet_dict(pet)}


@router.post("/feed")
def feed_pet_endpoint(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return error_response("UNAUTHORIZED")
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        pet = feed_pet(user_id, db)
    except ValueError as e:
        return error_response(str(e))

    return {"success": True, "pet": _pet_dict(pet)}


@router.patch("")
def rename_pet_endpoint(
    body: RenamePetRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return error_response("UNAUTHORIZED")
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        pet = rename_pet(user_id, body.pet_name, db)
    except ValueError as e:
        return error_response(str(e))

    return {"success": True, "pet": _pet_dict(pet)}


@router.post("/interact")
def interact_pet_endpoint(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return error_response("UNAUTHORIZED")
    payload = decode_token(credentials.credentials)
    user_id = payload["user_id"]

    try:
        pet = interact_with_pet(user_id, db)
    except ValueError as e:
        return error_response(str(e))

    return {"success": True, "pet": _pet_dict(pet)}
