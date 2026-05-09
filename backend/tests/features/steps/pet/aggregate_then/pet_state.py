from behave import then
from app.repositories.pet_repository import PetRepository


@then("系統中電子寵物的狀態應為：")
def step_then_pet_state(context):
    context.db_session.expire_all()
    repo = PetRepository(context.db_session)
    pet = repo.find_by_user(context.current_user_id)
    assert pet is not None, "Pet not found for current user"
    expected = context.table[0]
    if "happiness" in context.table.headings:
        assert pet.happiness == int(expected["happiness"]), (
            f"Expected happiness={expected['happiness']}, got {pet.happiness}"
        )
    if "fullness" in context.table.headings:
        assert pet.fullness == int(expected["fullness"]), (
            f"Expected fullness={expected['fullness']}, got {pet.fullness}"
        )
    if "level" in context.table.headings:
        assert pet.level == int(expected["level"]), (
            f"Expected level={expected['level']}, got {pet.level}"
        )
