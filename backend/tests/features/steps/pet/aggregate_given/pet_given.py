from behave import given
from app.models.pet import Pet
from app.repositories.pet_repository import PetRepository


@given("系統中有以下電子寵物：")
def step_given_pets(context):
    repo = PetRepository(context.db_session)
    for row in context.table:
        pet_id = int(row["pet_id"])
        pet = Pet(
            id=pet_id,
            user_id=int(row["user_id"]),
            species=row["species"],
            pet_name=row["pet_name"],
            happiness=int(row["happiness"]),
            fullness=int(row["fullness"]),
            level=int(row["level"]),
            created_by=pet_id,
        )
        repo.save(pet)
        context.ids["電子寵物"] = pet_id
