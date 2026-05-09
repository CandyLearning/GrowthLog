from behave import then
from app.repositories.user_repository import UserRepository


@then("系統中應存在以下使用者：")
def step_then_users_exist(context):
    repo = UserRepository(context.db_session)
    context.db_session.expire_all()
    for row in context.table:
        user = repo.find_by_google_id(row["google_id"])
        assert user is not None, f"User with google_id '{row['google_id']}' not found in DB"
        assert user.display_name == row["display_name"], (
            f"Expected display_name='{row['display_name']}', got '{user.display_name}'"
        )
        if row.get("avatar_url"):
            assert user.avatar_url == row["avatar_url"], (
                f"Expected avatar_url='{row['avatar_url']}', got '{user.avatar_url}'"
            )
