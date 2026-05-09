from behave import when


@when('使用者將學習目標 {goal_id:d} 的狀態更新為 "{status}"')
def step_when_update_goal_status(context, goal_id, status):
    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"

    body = {"status": status}
    response = context.api_client.patch(
        f"/api/goals/{goal_id}/status", json=body, headers=headers
    )
    context.last_response = response
