from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict, field_validator
from app.schemas.post import RaceResponse

class UpdateProfileRequest(BaseModel):
    username: str | None = Field(None, min_length=3, max_length=50)
    bio: str | None = Field(None, max_length=500)
    avatar_url: str | None = Field(None, max_length=500)
    banner_url: str | None = Field(None, max_length=500)
    location: str | None = Field(None, max_length=100)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str | None) -> str | None:
        if value is None:
            return value
        
        value = value.strip()
        if not value:
            raise ValueError("Username cannot be empty of whitespace only")
        return value
    
    @field_validator("bio", "avatar_url", "banner_url", "location")
    @classmethod
    def strip_optional_fields(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()
        return value or None

class PublicUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    race: RaceResponse
    bio: str | None
    avatar_url: str | None
    banner_url: str | None
    location: str | None
    followers_count: int = 0
    following_count: int = 0
    posts_count: int = 0
    is_followed_by_current_user: bool = False
    created_at: datetime
    
class PrivateUserResponse(PublicUserResponse):
    email: str
    is_admin: bool
    
class FollowStatusResponse(BaseModel):
    target_user_id: int
    followers_count: int
    is_followed_by_current_user: bool
    
class UserSearchResult(BaseModel):
    id: int
    username: str
    race: RaceResponse
    is_followed: bool