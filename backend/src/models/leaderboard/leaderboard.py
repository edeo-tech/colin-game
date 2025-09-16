from pydantic import Field
from typing import Optional
from models._base import MongoBaseModel

class NationalLeaderboard(MongoBaseModel):
    """National leaderboard entry model - individual user quiz scores"""
    username: str = Field(..., description="Player's username")
    user_id: str = Field(..., description="Player's unique user ID")
    score: int = Field(..., description="Score achieved in the quiz", ge=0)

class SchoolLeaderboard(MongoBaseModel):
    """School leaderboard entry model - daily aggregated school scores"""
    school_id: str = Field(..., description="School's unique ID")
    school_name: str = Field(..., description="School's name for display and filtering")
    total_score: int = Field(..., description="Total score for all users from this school on this date", ge=0)
    user_count: int = Field(..., description="Number of users who contributed to this total", ge=1)

class ScoreSubmission(MongoBaseModel):
    """Model for submitting a quiz score"""
    user_id: str = Field(..., description="Player's unique user ID")
    username: str = Field(..., description="Player's username")
    score: int = Field(..., description="Score achieved in the quiz", ge=0)
    school_id: Optional[str] = Field(None, description="Player's school ID (optional)")