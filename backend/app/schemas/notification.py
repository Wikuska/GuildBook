from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models import NotificationType


class NotificationResponse(BaseModel):
    id: int
    actor_id: int
    actor_username: str
    type: NotificationType
    post_id: int | None
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UnreadCountResponse(BaseModel):
    unread_count: int
