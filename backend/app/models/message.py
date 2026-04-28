from typing import TYPE_CHECKING
from sqlalchemy import Boolean, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .base import Base

if TYPE_CHECKING:
    from app.models.user import User

class Conversation(Base):
	__tablename__ = "conversations"

	id: Mapped[int] = mapped_column(primary_key=True)
	participant_one_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
	participant_two_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
	created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

	participant_one: Mapped["User"] = relationship("User", foreign_keys=[participant_one_id])
	participant_two: Mapped["User"] = relationship("User", foreign_keys=[participant_two_id])
	messages: Mapped[list["Message"]] = relationship("Message", order_by="Message.created_at.desc()", back_populates="conversation")


class Message(Base):
	__tablename__ = "messages"

	id: Mapped[int] = mapped_column(primary_key=True)
	conversation_id: Mapped[int] = mapped_column(ForeignKey("conversations.id", ondelete="CASCADE"))
	content: Mapped[str] = mapped_column(Text, nullable=False)
	sender_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
	receiver_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
	is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
	created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

	sender: Mapped["User"] = relationship("User", foreign_keys=[sender_id])
	receiver: Mapped["User"] = relationship("User", foreign_keys=[receiver_id])
	conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="messages")
	created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
