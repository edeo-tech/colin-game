from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from models.users.user_role import UserRole

class AuthenticatedUser(BaseModel):
    id: str = Field(..., description="The unique identifier of the user")
    username: str = Field(..., description="The username of the user")
    email: str = Field(..., description="The email address of the user")
    profile_picture: Optional[str] = Field('', description="The profile picture URL of the user")
    xp_earned: int = Field(..., description="The amount of XP the user has earned")
    profile_qrcode: Optional[str] = Field('', description="The profile QR code URL of the user")
    radius: int = Field(..., description="The user's notification radius in miles")
    is_banned: bool = Field(..., description="Whether the user is banned")
    last_login: Optional[datetime] = Field(None, description="The last time the user logged in")
    school_id: Optional[str] = Field(None, description="The ID of the school the user attends")
    role: UserRole = Field(UserRole.USER, description="The role of the user (USER or ADMIN)") 
