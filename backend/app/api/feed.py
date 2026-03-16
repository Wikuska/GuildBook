from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services import auth as auth_service
from app.services import feed as feed_service
from app.models import User
from app.schemas.post import PostResponse


router = APIRouter(prefix="/feed", tags=["feed"])

@router.get("/", response_model=list[PostResponse])
def get_feed(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user),
):
    return feed_service.get_feed(db, skip, limit, current_user)