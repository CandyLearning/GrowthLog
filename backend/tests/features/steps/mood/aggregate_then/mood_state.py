from behave import then
from app.repositories.mood_entry_repository import MoodEntryRepository


@then('系統中心情紀錄 {entry_id:d} 的 mood_type 應為 "{expected_mood_type}"')
def step_then_mood_type(context, entry_id, expected_mood_type):
    context.db_session.expire_all()
    repo = MoodEntryRepository(context.db_session)
    entry = repo.find_by_id(entry_id)
    assert entry is not None, f"Mood entry {entry_id} not found"
    assert entry.mood_type == expected_mood_type, (
        f"Expected mood_type='{expected_mood_type}', got '{entry.mood_type}'"
    )


@then("系統中不應存在心情紀錄 {entry_id:d}")
def step_then_mood_not_exist(context, entry_id):
    context.db_session.expire_all()
    repo = MoodEntryRepository(context.db_session)
    entry = repo.find_by_id(entry_id)
    assert entry is None, f"Mood entry {entry_id} should not exist but was found"
