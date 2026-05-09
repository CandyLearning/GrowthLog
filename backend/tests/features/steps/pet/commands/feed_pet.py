from behave import when


@when("使用者餵食電子寵物")
def step_when_feed_pet(context):
    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"

    response = context.api_client.post("/api/pet/feed", headers=headers)
    context.last_response = response
