from behave import when
from app.repositories.learning_goal_repository import LearningGoalRepository


@when("使用者建立學習目標：")
def step_when_create_goal(context):
    row = context.table[0]
    body = {}
    for col in context.table.headings:
        body[col] = row[col] or None

    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"

    response = context.api_client.post("/api/goals", json=body, headers=headers)
    context.last_response = response

    if response.status_code == 200 and response.json().get("success"):
        repo = LearningGoalRepository(context.db_session)
        goals = repo.find_all_by_user(context.current_user_id)
        if goals:
            context.ids["學習目標"] = goals[-1].id
