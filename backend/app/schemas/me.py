from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
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
    
class PrivateUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    email: str
    username: str
    bio: str | None = None
    avatar_url: str | None = None
    banner_url: str | None = None
    location: str | None = None
    
class UserFeedResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    race: RaceResponse
    avatar_url: str | None = None
    followers_count: int = 0
    following_count: int = 0
    
class ChangePasswordRequest(BaseModel):
    old_password: str = Field(..., min_length=1, description="Current password")
    new_password: str = Field(..., min_length=8, description="New password")

class ChangeEmailRequest(BaseModel):
    new_email: EmailStr
    