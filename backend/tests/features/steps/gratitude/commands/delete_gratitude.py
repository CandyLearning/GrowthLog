from behave import when


@when("使用者刪除感謝條目 {entry_id:d}")
def step_when_delete_gratitude(context, entry_id):
    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"

    response = context.api_client.delete(
        f"/api/gratitude/{entry_id}", headers=headers
    )
    context.last_response = response
