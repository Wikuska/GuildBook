from sqlalchemy import String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from .base import Base

class Post(Base):
	__tablename__ = 'posts'

	id: Mapped[int] = mapped_column(primary_key=True)
	title: Mapped[str] = mapped_column(String(255), nullable=False)
	content: Mapped[str] = mapped_column(Text, nullable=False)
	author_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
	category_id: Mapped[int] = mapped_column(ForeignKey('categories.id'), nullable=False)
	created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class PostTag(Base):
	__tablename__ = 'post_tags'

	post_id: Mapped[int] = mapped_column(ForeignKey('posts.id'), primary_key=True)
	tag_id: Mapped[int] = mapped_column(ForeignKey('tags.id'), primary_key=True)

class PostVisibleRace(Base):
	__tablename__ = 'post_visible_races'

	post_id: Mapped[int] = mapped_column(ForeignKey('posts.id'), primary_key=True)
	race_id: Mapped[int] = mapped_column(ForeignKey('races.id'), primary_key=True)
