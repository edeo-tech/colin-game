from pydantic import Field
from models._base import MongoBaseModel

class LeaderboardEntry(MongoBaseModel):
    """Leaderboard entry model"""
    username: str = Field(..., description="Player's username")
    user_id: str = Field(..., description="Player's unique user ID")
    score: int = Field(..., description="Score achieved in the quiz", ge=0)

class LeaderboardEntryCreate(MongoBaseModel):
    """Model for creating leaderboard entries"""
    username: str = Field(..., description="Player's username")
    user_id: str = Field(..., description="Player's unique user ID")
    score: int = Field(..., description="Score achieved in the quiz", ge=0)