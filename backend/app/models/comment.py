from sqlalchemy import Text, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.models.user import User
from .base import Base

class Comment(Base):
    __tablename__ = 'comments'

    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    post_id: Mapped[int] = mapped_column(ForeignKey('posts.id', ondelete="CASCADE"), nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    author: Mapped["User"] = relationship("User", lazy="joined")
