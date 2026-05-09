from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.goals import router as goals_router
from app.api.records import router as records_router
from app.api.moods import router as moods_router
from app.api.gratitude import router as gratitude_router
from app.api.pet import router as pet_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(users_router)
router.include_router(goals_router)
router.include_router(records_router)
router.include_router(moods_router)
router.include_router(gratitude_router)
router.include_router(pet_router)
