from behave import given
from datetime import date
from app.models.gratitude_entry import GratitudeEntry
from app.repositories.gratitude_entry_repository import GratitudeEntryRepository


@given("系統中有以下感謝條目：")
def step_given_gratitude_entries(context):
    repo = GratitudeEntryRepository(context.db_session)
    for row in context.table:
        entry_id = int(row["entry_id"])
        entry = GratitudeEntry(
            id=entry_id,
            user_id=int(row["user_id"]),
            content=row["content"],
            entry_date=date.fromisoformat(row["entry_date"]),
            created_by=entry_id,
        )
        repo.save(entry)
        context.ids["感謝條目"] = entry_id
