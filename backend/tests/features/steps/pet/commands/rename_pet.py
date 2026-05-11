from behave import when, then
from app.repositories.pet_repository import PetRepository


def _call_rename(context, new_name):
    headers = {}
    if context.current_user_id is not None:
        token = context.jwt_helper.generate_token(context.current_user_id)
        headers["Authorization"] = f"Bearer {token}"
    response = context.api_client.patch("/api/pet", json={"pet_name": new_name}, headers=headers)
    context.last_response = response


@when('使用者將電子寵物改名為 "{new_name}"')
def step_when_rename_pet(context, new_name):
    _call_rename(context, new_name)


@when('使用者將電子寵物改名為 ""')
def step_when_rename_pet_empty(context):
    _call_rename(context, "")


@then('系統中電子寵物的名稱應為 "{expected_name}"')
def step_then_pet_name(context, expected_name):
    context.db_session.expire_all()
    repo = PetRepository(context.db_session)
    pet = repo.find_by_user(context.current_user_id)
    assert pet is not None, "Pet not found for current user"
    assert pet.pet_name == expected_name, (
        f"Expected pet_name={expected_name!r}, got {pet.pet_name!r}"
    )
