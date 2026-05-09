import os
import jwt

SECRET = os.getenv("JWT_SECRET", "test-secret-key")
ALGORITHM = "HS256"


def create_token(user_id: int) -> str:
    return jwt.encode({"user_id": user_id}, SECRET, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET, algorithms=[ALGORITHM])
