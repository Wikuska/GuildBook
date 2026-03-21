from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime

class SendMessageRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)
    
    @field_validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Message content cannot be empty or whitespace only")
        return value.strip()

class MessageResponse(BaseModel):
    id: int
    content: str
    sender_id: int
    receiver_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)