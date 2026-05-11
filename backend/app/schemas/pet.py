from typing import Optional
from pydantic import BaseModel


class CreatePetRequest(BaseModel):
    species: Optional[str] = None
    pet_name: Optional[str] = None


class RenamePetRequest(BaseModel):
    pet_name: str


class PetStatusResponse(BaseModel):
    species: str
    pet_name: str
    happiness: int
    fullness: int
    level: int
