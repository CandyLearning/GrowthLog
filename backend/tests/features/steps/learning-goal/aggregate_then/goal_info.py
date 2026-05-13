from behave import then
from app.repositories.learning_goal_repository import LearningGoalRepository


@then("系統中學習目標 {goal_id:d} 的資訊應更新為：")
def step_then_goal_info(context, goal_id):
    repo = LearningGoalRepository(context.db_session)
    context.db_session.expire_all()
    goal = repo.find_by_id(goal_id)
    assert goal is not None, f"Goal {goal_id} not found"

    row = context.table[0]
    for col in context.table.headings:
        val = row[col] if row[col] else None
        if col == "title":
            assert goal.title == val, f"Expected title='{val}', got '{goal.title}'"
        elif col == "description":
            assert goal.description == val, f"Expected description='{val}', got '{goal.description}'"
        elif col == "start_date":
            actual = goal.start_date.isoformat() if goal.start_date else None
            assert actual == val, f"Expected start_date='{val}', got '{actual}'"
        elif col == "end_date":
            actual = goal.end_date.isoformat() if goal.end_date else None
            assert actual == val, f"Expected end_date='{val}', got '{actual}'"
