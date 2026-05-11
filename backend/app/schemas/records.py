from typing import Optional
from pydantic import BaseModel


class UpdateRecordRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
