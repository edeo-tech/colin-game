from models.auth.refresh import RefreshToken
from models.users.users import User
from models.questions.questions import BaseQuestion
from models.leaderboard.leaderboard import LeaderboardEntry

CollectionModelMatch = {
    'refresh_tokens': RefreshToken,
    'users': User,
    'questions': BaseQuestion,  # Using base question model for all question types
    'leaderboard': LeaderboardEntry
}
