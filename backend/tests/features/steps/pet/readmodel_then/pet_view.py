from behave import then


@then("查詢結果應為：")
def step_then_pet_view(context):
    pet = context.query_result
    assert pet is not None, f"Expected pet data, got: {context.last_response.json()}"
    expected = context.table[0]
    for col in context.table.headings:
        actual = str(pet.get(col) or "")
        assert actual == expected[col], (
            f"Expected {col}='{expected[col]}', got '{actual}'"
        )
