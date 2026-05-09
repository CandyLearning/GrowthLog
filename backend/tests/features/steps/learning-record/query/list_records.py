from behave import when


@when("使用者查詢學習目標 {goal_id:d} 下的學習紀錄")
def step_when_list_records(context, goal_id):
    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"
    response = context.api_client.get(f"/api/goals/{goal_id}/records", headers=headers)
    context.last_response = response
    context.query_result = response.json().get("records", [])
