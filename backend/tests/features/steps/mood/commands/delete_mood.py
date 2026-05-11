from behave import when


@when("使用者刪除心情紀錄 {entry_id:d}")
def step_when_delete_mood(context, entry_id):
    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"

    response = context.api_client.delete(
        f"/api/moods/{entry_id}", headers=headers
    )
    context.last_response = response
