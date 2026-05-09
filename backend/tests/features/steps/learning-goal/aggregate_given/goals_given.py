from behave import given
from app.models.learning_goal import LearningGoal
from app.repositories.learning_goal_repository import LearningGoalRepository


@given("系統中有以下學習目標：")
def step_given_goals(context):
    repo = LearningGoalRepository(context.db_session)
    for row in context.table:
        goal_id = int(row["goal_id"])
        goal = LearningGoal(
            id=goal_id,
            user_id=int(row["user_id"]),
            title=row["title"],
            description=row.get("description") or None,
            start_date=row.get("start_date") or None,
            end_date=row.get("end_date") or None,
            status=row.get("status", "not_started"),
            created_by=goal_id,
        )
        repo.save(goal)
        context.ids["學習目標"] = goal_id
