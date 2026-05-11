from behave import when


@when("使用者編輯學習目標 {goal_id:d} 的學習紀錄 {record_id:d}：")
def step_when_update_record(context, goal_id, record_id):
    row = context.table[0]
    body = {}
    for col in context.table.headings:
        val = row[col]
        body[col] = val if val else None

    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"

    response = context.api_client.patch(
        f"/api/goals/{goal_id}/records/{record_id}", json=body, headers=headers
    )
    context.last_response = response
