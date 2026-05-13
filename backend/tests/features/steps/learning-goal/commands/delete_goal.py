from behave import when


@when("使用者刪除學習目標 {goal_id:d}")
def step_when_delete_goal(context, goal_id):
    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"

    response = context.api_client.delete(
        f"/api/goals/{goal_id}", headers=headers
    )
    context.last_response = response
