from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, DateTime, func, Boolean, text, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .base import Base

if TYPE_CHECKING:
    from .post import Post

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    race_id: Mapped[int] = mapped_column(ForeignKey('races.id'), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    banner_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    location: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    posts: Mapped[list["Post"]] = relationship(back_populates="author")

class UserFollow(Base):
    __tablename__ = "user_follows"
    
    follower_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    followed_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    follower: Mapped["User"] = relationship("User", foreign_keys=[follower_id])
    followed: Mapped["User"] = relationship("User", foreign_keys=[followed_id])