from sqlalchemy import String, ForeignKey, DateTime, func, Boolean, text
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from .base import Base

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="false")
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    race_id: Mapped[int] = mapped_column(ForeignKey('races.id'), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
