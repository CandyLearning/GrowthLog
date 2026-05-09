from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.gratitude_entry import GratitudeEntry


class GratitudeEntryRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, entry: GratitudeEntry) -> GratitudeEntry:
        self.session.add(entry)
        self.session.flush()
        entry.created_by = entry.id
        self.session.commit()
        return entry

    def save(self, entry: GratitudeEntry) -> GratitudeEntry:
        self.session.merge(entry)
        self.session.commit()
        return entry

    def find_by_id(self, entry_id: int) -> Optional[GratitudeEntry]:
        return self.session.query(GratitudeEntry).filter_by(id=entry_id).first()

    def find_all_by_user(self, user_id: int) -> List[GratitudeEntry]:
        return (
            self.session.query(GratitudeEntry)
            .filter_by(user_id=user_id)
            .order_by(GratitudeEntry.entry_date.desc())
            .all()
        )

    def delete(self, entry: GratitudeEntry) -> None:
        self.session.delete(entry)
        self.session.commit()
