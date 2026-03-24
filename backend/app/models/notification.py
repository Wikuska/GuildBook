import enum
from typing import TYPE_CHECKING
from datetime import datetime
from sqlalchemy import ForeignKey, DateTime, Boolean, func, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.post import Post

class NotificationType(str, enum.Enum):
    follow = "follow"
    post_like = "post_like"
    post_comment = "post_comment"

class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True)
    recipient_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    actor_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type: Mapped[NotificationType] = mapped_column(SAEnum(NotificationType), nullable=False)
    post_id: Mapped[int | None] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"), nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    recipient: Mapped["User"] = relationship("User", foreign_keys=[recipient_id])
    actor: Mapped["User"] = relationship("User", foreign_keys=[actor_id])
    post: Mapped["Post | None"] = relationship("Post")