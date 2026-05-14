from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.post import RaceResponse

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
    
class FollowStatusResponse(BaseModel):
    target_user_id: int
    followers_count: int
    is_followed_by_current_user: bool
    
class UserSearchResult(BaseModel):
    id: int
    username: str
    race: RaceResponse
    is_followed: bool