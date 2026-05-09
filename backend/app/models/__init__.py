from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


from app.models.user import User  # noqa: E402, F401
from app.models.learning_goal import LearningGoal  # noqa: E402, F401
from app.models.learning_record import LearningRecord  # noqa: E402, F401
from app.models.mood_entry import MoodEntry  # noqa: E402, F401
from app.models.mood_tag import MoodTag  # noqa: E402, F401
from app.models.mood_entry_tag import MoodEntryTag  # noqa: E402, F401
from app.models.gratitude_entry import GratitudeEntry  # noqa: E402, F401
from app.models.pet import Pet  # noqa: E402, F401
