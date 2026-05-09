from behave import when


@when("使用者查詢學習目標列表")
def step_when_list_goals(context):
    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"
    response = context.api_client.get("/api/goals", headers=headers)
    context.last_response = response
    context.query_result = response.json().get("goals", [])
