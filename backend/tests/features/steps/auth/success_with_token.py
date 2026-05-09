from behave import then


@then("操作成功，回傳 session token")
def step_then_success_with_token(context):
    assert context.last_response is not None, "No response received"
    assert context.last_response.status_code == 200, (
        f"Expected HTTP 200, got {context.last_response.status_code}: "
        f"{context.last_response.text}"
    )
    resp = context.last_response.json()
    assert resp.get("token"), f"Expected 'token' in response, got: {resp}"
    context.memo["token"] = resp["token"]
