from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime
from app.schemas.post import AuthorResponse


class SendMessageRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)

    @field_validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Message content cannot be empty or whitespace only")
        return value.strip()


class MessagePreviewResponse(BaseModel):
    id: int
    content: str
    sender_id: int
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MessageResponse(BaseModel):
    id: int
    content: str
    sender_id: int
    receiver_id: int
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ConversationResponse(BaseModel):
    id: int
    other_participant: AuthorResponse
    last_message: MessagePreviewResponse | None
    unread_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
    
class UnreadCountResponse(BaseModel):
    unread_count: int