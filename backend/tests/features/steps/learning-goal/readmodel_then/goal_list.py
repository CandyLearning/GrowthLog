from behave import then


def _fetch_goals(context):
    if context.query_result is not None:
        return context.query_result
    headers = {}
    if context.current_user_id:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"
    response = context.api_client.get("/api/goals", headers=headers)
    return response.json().get("goals", [])


def _row_matches(goal, expected_row, headings):
    return all(
        str(goal.get(col) or "") == expected_row[col]
        for col in headings
        if expected_row[col] != ""
    )


@then("查詢結果應包含以下學習目標：")
def step_then_goal_list_contains(context):
    goals = _fetch_goals(context)
    last_index = -1
    for expected_row in context.table:
        for i in range(last_index + 1, len(goals)):
            if _row_matches(goals[i], expected_row, context.table.headings):
                last_index = i
                break
        else:
            row_dict = {col: expected_row[col] for col in context.table.headings}
            assert False, (
                f"Expected goal not found (in order) after position {last_index}: "
                f"{row_dict}\nActual goals: {goals}"
            )


@then("查詢結果應為空")
def step_then_empty_list(context):
    goals = _fetch_goals(context)
    assert goals == [], f"Expected empty list, got: {goals}"
