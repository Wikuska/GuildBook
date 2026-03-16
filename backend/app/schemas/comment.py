from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class CreateCommentRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)


class CommentResponse(BaseModel):
    id: int
    content: str
    author_id: int
    post_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
