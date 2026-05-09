from behave import then
from app.repositories.gratitude_entry_repository import GratitudeEntryRepository


@then('系統中感謝條目 {entry_id:d} 的內容應為 "{expected_content}"')
def step_then_gratitude_content(context, entry_id, expected_content):
    context.db_session.expire_all()
    repo = GratitudeEntryRepository(context.db_session)
    entry = repo.find_by_id(entry_id)
    assert entry is not None, f"Gratitude entry {entry_id} not found"
    assert entry.content == expected_content, (
        f"Expected content='{expected_content}', got '{entry.content}'"
    )


@then("系統中不應存在感謝條目 {entry_id:d}")
def step_then_gratitude_not_exist(context, entry_id):
    context.db_session.expire_all()
    repo = GratitudeEntryRepository(context.db_session)
    entry = repo.find_by_id(entry_id)
    assert entry is None, f"Gratitude entry {entry_id} should not exist but was found"
