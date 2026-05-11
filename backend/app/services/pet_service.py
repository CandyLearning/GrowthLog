import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.models.pet import Pet, PET_SPECIES
from app.repositories.pet_repository import PetRepository

logger = logging.getLogger(__name__)

_VALID_SPECIES = set(PET_SPECIES)


def create_pet(user_id: int, species: Optional[str], pet_name: Optional[str], db: Session) -> None:
    if not pet_name or not pet_name.strip():
        raise ValueError("MISSING_REQUIRED_FIELD")
    if not species or species not in _VALID_SPECIES:
        raise ValueError("INVALID_VALUE")

    repo = PetRepository(db)
    if repo.find_by_user(user_id) is not None:
        raise ValueError("ALREADY_EXISTS")

    pet = Pet(
        user_id=user_id,
        species=species,
        pet_name=pet_name,
        happiness=100,
        fullness=100,
        level=1,
        created_by=0,
    )
    repo.create(pet)
    logger.info("Pet created: user_id=%s species=%s", user_id, species)


def get_pet(user_id: int, db: Session) -> Pet:
    repo = PetRepository(db)
    pet = repo.find_by_user(user_id)
    if pet is None:
        raise ValueError("NOT_FOUND")
    return pet


def feed_pet(user_id: int, db: Session) -> Pet:
    repo = PetRepository(db)
    pet = repo.find_by_user(user_id)
    if pet is None:
        raise ValueError("NOT_FOUND")
    pet.fullness = pet.fullness + 20
    pet.updated_by = user_id
    db.commit()
    logger.info("Pet fed: user_id=%s fullness=%s", user_id, pet.fullness)
    return pet


def interact_with_pet(user_id: int, db: Session) -> Pet:
    repo = PetRepository(db)
    pet = repo.find_by_user(user_id)
    if pet is None:
        raise ValueError("NOT_FOUND")
    pet.happiness = pet.happiness + 5
    pet.updated_by = user_id
    db.commit()
    logger.info("Pet interacted: user_id=%s happiness=%s", user_id, pet.happiness)
    return pet


def update_pet_happiness(user_id: int, amount: int, db: Session) -> None:
    repo = PetRepository(db)
    pet = repo.find_by_user(user_id)
    if pet is not None:
        pet.happiness = pet.happiness + amount
        pet.updated_by = user_id
        db.commit()


def rename_pet(user_id: int, pet_name: str, db: Session) -> Pet:
    if not pet_name or not pet_name.strip():
        raise ValueError("MISSING_REQUIRED_FIELD")
    repo = PetRepository(db)
    pet = repo.find_by_user(user_id)
    if pet is None:
        raise ValueError("NOT_FOUND")
    pet.pet_name = pet_name.strip()
    pet.updated_by = user_id
    db.commit()
    logger.info("Pet renamed: user_id=%s pet_name=%s", user_id, pet_name)
    return pet
