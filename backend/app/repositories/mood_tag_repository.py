from typing import Optional
from sqlalchemy.orm import Session
from app.models.mood_tag import MoodTag


class MoodTagRepository:
    def __init__(self, session: Session):
        self.session = session

    def save(self, tag: MoodTag) -> MoodTag:
        self.session.merge(tag)
        self.session.commit()
        return tag

    def find_by_id(self, tag_id: int) -> Optional[MoodTag]:
        return self.session.query(MoodTag).filter_by(id=tag_id).first()
