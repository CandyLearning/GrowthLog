from behave import when


@when("使用者編輯心情紀錄 {entry_id:d}：")
def step_when_update_mood(context, entry_id):
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
        f"/api/moods/{entry_id}", json=body, headers=headers
    )
    context.last_response = response
