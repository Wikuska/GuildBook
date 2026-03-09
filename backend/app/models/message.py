from sqlalchemy import Text, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from .base import Base

class Message(Base):
	__tablename__ = 'messages'

	id: Mapped[int] = mapped_column(primary_key=True)
	content: Mapped[str] = mapped_column(Text, nullable=False)
	sender_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
	receiver_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
	created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
