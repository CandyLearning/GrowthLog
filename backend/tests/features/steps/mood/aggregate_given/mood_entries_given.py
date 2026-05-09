from behave import given
from datetime import date
from app.models.mood_entry import MoodEntry
from app.repositories.mood_entry_repository import MoodEntryRepository


@given("系統中有以下心情紀錄：")
def step_given_mood_entries(context):
    repo = MoodEntryRepository(context.db_session)
    for row in context.table:
        entry_id = int(row["entry_id"])
        entry = MoodEntry(
            id=entry_id,
            user_id=int(row["user_id"]),
            mood_type=row["mood_type"],
            note=row.get("note") or None,
            entry_date=date.fromisoformat(row["entry_date"]),
            created_by=entry_id,
        )
        repo.save(entry)
        context.ids["心情紀錄"] = entry_id
