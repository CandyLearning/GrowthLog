from typing import List, Optional
from pydantic import BaseModel


class CreateGoalRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class Goal(BaseModel):
    goal_id: int
    title: str
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: str


class GoalListResponse(BaseModel):
    goals: List[Goal]


class UpdateGoalStatusRequest(BaseModel):
    status: str
