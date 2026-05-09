from typing import List, Optional
from pydantic import BaseModel


class CreateGratitudeRequest(BaseModel):
    content: Optional[str] = None


class UpdateGratitudeRequest(BaseModel):
    content: Optional[str] = None


class GratitudeEntryResponse(BaseModel):
    entry_id: int
    content: str
    entry_date: str


class GratitudeListResponse(BaseModel):
    entries: List[GratitudeEntryResponse]
