from behave import when


@when("使用者編輯感謝條目 {entry_id:d}：")
def step_when_update_gratitude(context, entry_id):
    row = context.table[0]
    body = {"content": row["content"] or None}

    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"

    response = context.api_client.patch(
        f"/api/gratitude/{entry_id}", json=body, headers=headers
    )
    context.last_response = response
