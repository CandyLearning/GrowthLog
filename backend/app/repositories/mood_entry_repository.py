from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.mood_entry import MoodEntry
from app.models.mood_entry_tag import MoodEntryTag


class MoodEntryRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, entry: MoodEntry, tag_ids: List[int] = None) -> MoodEntry:
        self.session.add(entry)
        self.session.flush()
        entry.created_by = entry.id
        if tag_ids:
            for tag_id in tag_ids:
                self.session.add(MoodEntryTag(mood_entry_id=entry.id, tag_id=tag_id))
        self.session.commit()
        return entry

    def save(self, entry: MoodEntry) -> MoodEntry:
        self.session.merge(entry)
        self.session.commit()
        return entry

    def find_by_id(self, entry_id: int) -> Optional[MoodEntry]:
        return self.session.query(MoodEntry).filter_by(id=entry_id).first()

    def find_all_by_user(self, user_id: int) -> List[MoodEntry]:
        return (
            self.session.query(MoodEntry)
            .filter_by(user_id=user_id)
            .order_by(MoodEntry.entry_date.desc())
            .all()
        )

    def delete(self, entry: MoodEntry) -> None:
        self.session.delete(entry)
        self.session.commit()
