from behave import when


@when("使用者建立電子寵物：")
def step_when_create_pet(context):
    row = context.table[0]
    body = {
        "species": row["species"] or None,
        "pet_name": row["pet_name"] or None,
    }

    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"

    response = context.api_client.post("/api/pet", json=body, headers=headers)
    context.last_response = response
