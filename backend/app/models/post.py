from typing import TYPE_CHECKING
from sqlalchemy import String, Text, ForeignKey, DateTime, func, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .base import Base

if TYPE_CHECKING:
    from .tag import Tag
    from .category import Category
    from .race import Race
    from .user import User

class Post(Base):
	__tablename__ = 'posts'

	id: Mapped[int] = mapped_column(primary_key=True)
	title: Mapped[str] = mapped_column(String(255), nullable=False)
	content: Mapped[str] = mapped_column(Text, nullable=False)
	author_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
	author: Mapped["User"] = relationship(back_populates="posts")
	category_id: Mapped[int] = mapped_column(ForeignKey('categories.id'), nullable=False)
	category: Mapped["Category"] = relationship()
	created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
	tags: Mapped[list["Tag"]] = relationship(secondary="post_tags",back_populates="posts",)
	visible_races: Mapped[list["Race"]] = relationship(secondary="post_visible_races", back_populates="posts")

class PostTag(Base):
	__tablename__ = 'post_tags'

	post_id: Mapped[int] = mapped_column(ForeignKey('posts.id', ondelete="CASCADE"), primary_key=True)
	tag_id: Mapped[int] = mapped_column(ForeignKey('tags.id'), primary_key=True)

class PostVisibleRace(Base):
	__tablename__ = 'post_visible_races'

	post_id: Mapped[int] = mapped_column(ForeignKey('posts.id', ondelete="CASCADE"), primary_key=True)
	race_id: Mapped[int] = mapped_column(ForeignKey('races.id'), primary_key=True)
 
class PostLike(Base):
    __tablename__ = 'post_likes'

    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    post: Mapped["Post"] = relationship("Post")
    user: Mapped["User"] = relationship("User")
