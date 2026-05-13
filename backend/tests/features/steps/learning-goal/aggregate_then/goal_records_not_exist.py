from behave import then
from app.repositories.learning_record_repository import LearningRecordRepository


@then("系統中不應存在屬於 goal_id 為 {goal_id:d} 的學習紀錄")
def step_then_goal_records_not_exist(context, goal_id):
    repo = LearningRecordRepository(context.db_session)
    context.db_session.expire_all()
    records = repo.find_all_by_goal(goal_id)
    assert len(records) == 0, (
        f"Expected no records for goal {goal_id}, found {len(records)}"
    )
