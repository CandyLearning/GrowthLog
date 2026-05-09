from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.api import router as api_router
from app.core.config import settings
from app.core.deps import set_session_factory


def create_app() -> FastAPI:
    app = FastAPI(title="growthlog API", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix="/api")

    @app.on_event("startup")
    def startup():
        engine = create_engine(settings.DATABASE_URL)
        factory = sessionmaker(bind=engine)
        set_session_factory(factory)

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()
