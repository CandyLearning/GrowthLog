from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User


class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, user: User) -> User:
        self.session.add(user)
        self.session.flush()
        user.created_by = user.id
        self.session.commit()
        return user

    def save(self, user: User) -> User:
        self.session.merge(user)
        self.session.commit()
        return user

    def find_by_id(self, user_id: int) -> Optional[User]:
        return self.session.query(User).filter_by(id=user_id).first()

    def find_by_google_id(self, google_id: str) -> Optional[User]:
        return self.session.query(User).filter_by(google_id=google_id).first()
