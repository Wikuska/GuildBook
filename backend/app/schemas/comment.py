from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from app.schemas.post import AuthorResponse


class CreateCommentRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)

class UpdateCommentRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)

class CommentResponse(BaseModel):
    id: int
    content: str
    author: AuthorResponse
    post_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
