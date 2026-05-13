from behave import then
from app.repositories.learning_goal_repository import LearningGoalRepository


@then("系統中不應存在 goal_id 為 {goal_id:d} 的學習目標")
def step_then_goal_not_exist(context, goal_id):
    repo = LearningGoalRepository(context.db_session)
    context.db_session.expire_all()
    goal = repo.find_by_id(goal_id)
    assert goal is None, f"Expected goal {goal_id} to be deleted, but it still exists"
