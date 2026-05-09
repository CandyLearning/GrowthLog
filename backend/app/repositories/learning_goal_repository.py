from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.learning_goal import LearningGoal


class LearningGoalRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, goal: LearningGoal) -> LearningGoal:
        self.session.add(goal)
        self.session.flush()
        goal.created_by = goal.id
        self.session.commit()
        return goal

    def save(self, goal: LearningGoal) -> LearningGoal:
        self.session.merge(goal)
        self.session.commit()
        return goal

    def find_by_id(self, goal_id: int) -> Optional[LearningGoal]:
        return self.session.query(LearningGoal).filter_by(id=goal_id).first()

    def find_all_by_user(self, user_id: int) -> List[LearningGoal]:
        return (
            self.session.query(LearningGoal)
            .filter_by(user_id=user_id)
            .order_by(LearningGoal.end_date.asc().nullslast())
            .all()
        )
