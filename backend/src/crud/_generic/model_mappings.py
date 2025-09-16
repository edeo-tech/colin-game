from models.auth.refresh import RefreshToken
from models.users.users import User
from models.questions.questions import BaseQuestion
from models.leaderboard.leaderboard import NationalLeaderboard, SchoolLeaderboard
from models.schools.school import School

CollectionModelMatch = {
    'refresh_tokens': RefreshToken,
    'users': User,
    'questions': BaseQuestion,  # Using base question model for all question types
    'national_leaderboard': NationalLeaderboard,
    'school_leaderboard': SchoolLeaderboard,
    'schools': School
}
