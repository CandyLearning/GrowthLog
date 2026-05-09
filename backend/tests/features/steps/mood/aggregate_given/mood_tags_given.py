from behave import given
from app.models.mood_tag import MoodTag
from app.repositories.mood_tag_repository import MoodTagRepository


@given("系統中有以下心情標籤：")
def step_given_mood_tags(context):
    repo = MoodTagRepository(context.db_session)
    for row in context.table:
        tag_id = int(row["tag_id"])
        tag = MoodTag(
            id=tag_id,
            user_id=int(row["user_id"]),
            tag_name=row["tag_name"],
            created_by=tag_id,
        )
        repo.save(tag)
