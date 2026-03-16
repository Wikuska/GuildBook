from typing import TYPE_CHECKING
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .post import Post

class Tag(Base):
	__tablename__ = 'tags'

	id: Mapped[int] = mapped_column(primary_key=True)
	name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
	posts: Mapped[list["Post"]] = relationship(secondary="post_tags", back_populates="tags")
