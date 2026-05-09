from typing import Optional
from pydantic import BaseModel


class UpdateUserProfileRequest(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
