from behave import given
from app.models.learning_record import LearningRecord
from app.repositories.learning_record_repository import LearningRecordRepository
from datetime import date


@given("系統中有以下學習紀錄：")
def step_given_records(context):
    repo = LearningRecordRepository(context.db_session)
    for row in context.table:
        record_id = int(row["record_id"])
        record = LearningRecord(
            id=record_id,
            goal_id=int(row["goal_id"]),
            user_id=int(row["user_id"]),
            title=row["title"],
            content=row.get("content") or None,
            entry_date=date.fromisoformat(row["entry_date"]) if row.get("entry_date") else date.today(),
            created_by=record_id,
        )
        repo.save(record)
        context.ids["學習紀錄"] = record_id
