from behave import when


@when("使用者以以下 Google 帳號資訊完成 OAuth 授權：")
def step_when_google_oauth(context):
    row = context.table[0]
    body = {
        "google_id": row["google_id"],
        "display_name": row["display_name"],
        "avatar_url": row.get("avatar_url") or None,
    }
    response = context.api_client.post("/api/auth/google", json=body)
    context.last_response = response
