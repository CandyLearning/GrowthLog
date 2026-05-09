from behave import then
from app.repositories.user_repository import UserRepository


@then("系統中使用者的個人資料應為：")
def step_then_user_profile(context):
    repo = UserRepository(context.db_session)
    context.db_session.expire_all()
    user_id = context.current_user_id or context.ids.get("使用者")
    user = repo.find_by_id(user_id)
    assert user is not None, f"User with id '{user_id}' not found"
    row = context.table[0]
    if "display_name" in context.table.headings:
        assert user.display_name == row["display_name"], (
            f"Expected display_name='{row['display_name']}', got '{user.display_name}'"
        )
    if "avatar_url" in context.table.headings:
        assert user.avatar_url == row["avatar_url"], (
            f"Expected avatar_url='{row['avatar_url']}', got '{user.avatar_url}'"
        )
