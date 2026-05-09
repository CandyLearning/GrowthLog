from typing import Optional
from sqlalchemy.orm import Session
from app.models.pet import Pet


class PetRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, pet: Pet) -> Pet:
        self.session.add(pet)
        self.session.flush()
        pet.created_by = pet.id
        self.session.commit()
        return pet

    def save(self, pet: Pet) -> Pet:
        self.session.merge(pet)
        self.session.commit()
        return pet

    def find_by_user(self, user_id: int) -> Optional[Pet]:
        return self.session.query(Pet).filter_by(user_id=user_id).first()
