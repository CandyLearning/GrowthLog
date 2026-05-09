from behave import then
from app.repositories.learning_goal_repository import LearningGoalRepository


@then('系統中學習目標 $學習目標.goal_id 的狀態應為 "{status}"')
def step_then_goal_status_by_context(context, status):
    repo = LearningGoalRepository(context.db_session)
    context.db_session.expire_all()
    goal_id = context.ids.get("學習目標")
    assert goal_id is not None, "找不到學習目標 ID，請先建立學習目標"
    goal = repo.find_by_id(goal_id)
    assert goal is not None, f"Goal with id '{goal_id}' not found"
    assert goal.status == status, f"Expected status='{status}', got '{goal.status}'"


@then('系統中學習目標 {goal_id:d} 的狀態應為 "{status}"')
def step_then_goal_status_by_id(context, goal_id, status):
    repo = LearningGoalRepository(context.db_session)
    context.db_session.expire_all()
    goal = repo.find_by_id(goal_id)
    assert goal is not None, f"Goal with id '{goal_id}' not found"
    assert goal.status == status, f"Expected status='{status}', got '{goal.status}'"
