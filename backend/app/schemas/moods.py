from typing import List, Optional
from pydantic import BaseModel


class CreateMoodRequest(BaseModel):
    mood_type: Optional[str] = None
    note: Optional[str] = None
    tag_ids: Optional[List[int]] = None


class UpdateMoodRequest(BaseModel):
    mood_type: Optional[str] = None
    note: Optional[str] = None


class MoodEntryResponse(BaseModel):
    entry_id: int
    mood_type: str
    note: Optional[str] = None
    entry_date: str


class MoodListResponse(BaseModel):
    entries: List[MoodEntryResponse]
