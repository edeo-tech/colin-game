from pydantic import Field, BaseModel
from typing import Optional
from datetime import datetime, timezone

from models._base import MongoBaseModel
from models.users.user_role import UserRole


class User(MongoBaseModel):
    username: Optional[str] = Field(
        default=None,
        description='The username of the user'
    )
    email:str = Field(
        ...,
        description='The email address of the user'
    )
    password:str = Field(
        ...,
        description='The password of the user'
    )
    profile_picture:str = Field(
        default='',
        description='The profile picture of the user URL'
    )
    xp_earned:int = Field(
        default=0,
        description='The amount of XP the user has earned'
    )
    profile_qrcode:str = Field(
        default='',
        description='The profile QR code of the user URL'
    )
    expo_notification_token:str = Field(
        default='',
        description='The Expo notification token of the user'
    )
    radius:int = Field(
        default=1,
        description='The radius within which the user will be notified of new airplanes. Default is one mile.'
    )
    last_lat:float = Field(
        ...,
        description='The latitude of the user'
    )
    last_long:float = Field(
        ...,
        description='The longitude of the user'
    )
    device_os:str = Field(
        ...,
        description='The operating system of the user'
    )
    last_login:datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description='The last time the user logged in'
    )
    is_banned:bool = Field(
        default=False,
        description='Whether the user is banned'
    )
    school_id: Optional[str] = Field(
        default=None,
        description='The ID of the school the user attends (optional)'
    )
    role: UserRole = Field(
        default=UserRole.USER,
        description='The role of the user (USER or ADMIN)'
    )


class LoginUser(BaseModel):
    email:str = Field(
        ...,
        description='The email address of the user'
    )
    password:str = Field(
        ...,
        description='The password of the user'
    )
