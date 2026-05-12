from behave import then
from app.exceptions import VIOLATION_STATUS_MAP


@then('操作失敗，violation_type 為 "{violation_type}"')
def step_then_failure_with_violation(context, violation_type):
    assert context.last_response is not None, "No response received"
    expected_status = VIOLATION_STATUS_MAP.get(violation_type, 400)
    assert context.last_response.status_code == expected_status, (
        f"Expected HTTP {expected_status}, got {context.last_response.status_code}"
    )
    resp = context.last_response.json()
    assert resp.get("success") is False, f"Expected success=false, got {resp}"
    actual_type = resp.get("error", {}).get("violation_type")
    assert actual_type == violation_type, (
        f"Expected violation_type='{violation_type}', got '{actual_type}'"
    )
