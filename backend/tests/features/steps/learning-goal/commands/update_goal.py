from behave import when


@when("使用者編輯學習目標 {goal_id:d}：")
def step_when_update_goal(context, goal_id):
    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"

    body = {}
    row = context.table[0]
    for col in context.table.headings:
        val = row[col] if row[col] else None
        body[col] = val

    response = context.api_client.patch(
        f"/api/goals/{goal_id}", json=body, headers=headers
    )
    context.last_response = response
