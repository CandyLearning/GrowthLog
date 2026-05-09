from typing import Optional
from pydantic import BaseModel


class GoogleAuthRequest(BaseModel):
    google_id: str
    display_name: str
    avatar_url: Optional[str] = None
