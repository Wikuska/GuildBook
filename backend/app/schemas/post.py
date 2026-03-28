from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class CategoryResponse(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)

class TagResponse(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)
    
class RaceResponse(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)

class CreatePostRequest(BaseModel):
    
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    category_id: int = Field(..., gt=0)
    visible_race_ids: list[int] = Field(default_factory=list) #Empty list - post visible to all races
    tag_ids: list[int] = Field(default_factory=list)
 
class PostLikeStatusResponse(BaseModel):
    post_id: int
    likes_count: int
    is_liked_by_current_user: bool
   
class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    author_id: int
    category: CategoryResponse
    created_at: datetime
    tags: list[TagResponse] = Field(default_factory=list)
    likes_count: int
    is_liked_by_current_user: bool
    
    model_config = ConfigDict(from_attributes=True)