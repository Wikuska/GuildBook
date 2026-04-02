from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.schemas.post import RaceResponse

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)
    race_id: int
    
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
class UserMeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    email: str
    username: str
    race_id: int
    is_admin: bool

class UserFeedResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    race: RaceResponse
    avatar_url: str | None = None
    followers_count: int = 0
    following_count: int = 0