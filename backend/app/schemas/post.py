from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class CreatePostRequest(BaseModel):
    
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    category_id: int = Field(..., gt=0)
    
class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    author_id: int
    category_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)