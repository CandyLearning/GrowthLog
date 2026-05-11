from behave import then, when
from app.repositories.learning_record_repository import LearningRecordRepository


@then('查詢學習目標 {goal_id:d} 的紀錄時，record_id 為 {record_id:d} 的標題應為 "{expected_title}"')
def step_then_record_title(context, goal_id, record_id, expected_title):
    context.db_session.expire_all()
    repo = LearningRecordRepository(context.db_session)
    record = repo.find_by_id(record_id)
    assert record is not None, f"Record {record_id} not found"
    assert record.goal_id == goal_id, f"Record {record_id} belongs to goal {record.goal_id}, not {goal_id}"
    assert record.title == expected_title, (
        f"Expected title='{expected_title}', got '{record.title}'"
    )


@then("查詢學習目標 {goal_id:d} 的紀錄時，不應存在 record_id 為 {record_id:d} 的紀錄")
def step_then_record_not_exist(context, goal_id, record_id):
    context.db_session.expire_all()
    repo = LearningRecordRepository(context.db_session)
    record = repo.find_by_id(record_id)
    assert record is None, f"Record {record_id} should not exist but was found"
