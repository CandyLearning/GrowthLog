from behave import when


@when("使用者更新個人資料：")
def step_when_update_profile(context):
    row = context.table[0]
    body = {}
    if "display_name" in context.table.headings:
        body["display_name"] = row["display_name"] or None
    if "avatar_url" in context.table.headings:
        body["avatar_url"] = row["avatar_url"] or None

    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"

    response = context.api_client.patch("/api/users/me", json=body, headers=headers)
    context.last_response = response
