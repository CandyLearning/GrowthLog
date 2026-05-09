from behave import then


def _row_matches(entry, expected_row, headings):
    return all(
        str(entry.get(col) or "") == expected_row[col]
        for col in headings
        if expected_row[col] != ""
    )


@then("查詢結果應包含以下心情紀錄：")
def step_then_mood_list_contains(context):
    entries = context.query_result or []
    last_index = -1
    for expected_row in context.table:
        for i in range(last_index + 1, len(entries)):
            if _row_matches(entries[i], expected_row, context.table.headings):
                last_index = i
                break
        else:
            row_dict = {col: expected_row[col] for col in context.table.headings}
            assert False, (
                f"Expected mood entry not found (in order) after position {last_index}: "
                f"{row_dict}\nActual entries: {entries}"
            )
