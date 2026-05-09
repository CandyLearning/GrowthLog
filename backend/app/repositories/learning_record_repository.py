from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.learning_record import LearningRecord


class LearningRecordRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, record: LearningRecord) -> LearningRecord:
        self.session.add(record)
        self.session.flush()
        record.created_by = record.id
        self.session.commit()
        return record

    def save(self, record: LearningRecord) -> LearningRecord:
        self.session.merge(record)
        self.session.commit()
        return record

    def find_by_id(self, record_id: int) -> Optional[LearningRecord]:
        return self.session.query(LearningRecord).filter_by(id=record_id).first()

    def find_all_by_goal(self, goal_id: int) -> List[LearningRecord]:
        return (
            self.session.query(LearningRecord)
            .filter_by(goal_id=goal_id)
            .order_by(LearningRecord.entry_date.desc())
            .all()
        )
