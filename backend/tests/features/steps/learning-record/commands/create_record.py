from behave import when


@when("使用者在學習目標 {goal_id:d} 下新增學習紀錄：")
def step_when_create_record(context, goal_id):
    row = context.table[0]
    # Send as form data (multipart) per api.yml spec
    form_data = {col: row[col] for col in context.table.headings if row[col]}

    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"

    response = context.api_client.post(
        f"/api/goals/{goal_id}/records",
        data=form_data,
        headers=headers,
    )
    context.last_response = response
