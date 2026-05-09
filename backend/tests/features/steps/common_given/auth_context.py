from behave import given


@given("以 $使用者.user_id 身份發出請求")
def step_given_auth_as_user(context):
    user_id = context.ids.get("使用者")
    if user_id is None:
        raise KeyError("找不到使用者 ID，請先用 Given 系統中有以下使用者：設定")
    context.current_user_id = user_id


@given("以使用者 {user_id:d} 的身份發出請求")
def step_given_auth_as_specific_user(context, user_id):
    context.current_user_id = user_id
