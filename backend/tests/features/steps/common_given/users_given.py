from behave import given
from app.models.user import User
from app.repositories.user_repository import UserRepository


@given("系統中有以下使用者：")
def step_given_users(context):
    repo = UserRepository(context.db_session)
    for row in context.table:
        user_id = int(row["user_id"])
        user = User(
            id=user_id,
            google_id=row.get("google_id", f"google-{user_id}"),
            display_name=row["display_name"],
            avatar_url=row.get("avatar_url") or None,
            created_by=user_id,
        )
        repo.save(user)
        context.ids["使用者"] = user_id
