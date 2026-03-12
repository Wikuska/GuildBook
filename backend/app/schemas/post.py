from pydantic import BaseModel, Field, ConfigDict

class CreatePostRequest(BaseModel):
    
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    category_id: int = Field(..., gt=0)