from behave import when


@when("使用者記錄心情：")
def step_when_record_mood(context):
    row = context.table[0]
    body = {}
    for col in context.table.headings:
        val = row[col]
        if col == "tag_ids":
            body["tag_ids"] = [int(v.strip()) for v in val.split(",") if v.strip()] if val else []
        else:
            body[col] = val or None

    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"

    response = context.api_client.post("/api/moods", json=body, headers=headers)
    context.last_response = response
