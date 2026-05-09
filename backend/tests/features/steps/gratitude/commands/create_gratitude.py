from behave import when


@when("使用者新增感謝條目：")
def step_when_create_gratitude(context):
    row = context.table[0]
    body = {"content": row["content"] or None}

    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"

    response = context.api_client.post("/api/gratitude", json=body, headers=headers)
    context.last_response = response
    context.query_result = None
