from behave import then


def _fetch_gratitude(context):
    if context.query_result is not None:
        return context.query_result
    headers = {}
    if context.current_user_id:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"
    response = context.api_client.get("/api/gratitude", headers=headers)
    return response.json().get("entries", [])


def _row_matches(entry, expected_row, headings):
    return all(
        str(entry.get(col) or "") == expected_row[col]
        for col in headings
        if expected_row[col] != ""
    )


@then("查詢結果應包含以下感謝條目：")
def step_then_gratitude_list_contains(context):
    entries = _fetch_gratitude(context)
    last_index = -1
    for expected_row in context.table:
        for i in range(last_index + 1, len(entries)):
            if _row_matches(entries[i], expected_row, context.table.headings):
                last_index = i
                break
        else:
            row_dict = {col: expected_row[col] for col in context.table.headings}
            assert False, (
                f"Expected gratitude entry not found (in order) after position {last_index}: "
                f"{row_dict}\nActual entries: {entries}"
            )
