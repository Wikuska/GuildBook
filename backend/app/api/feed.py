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
    tag_ids: list[int] | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user),
):
    return feed_service.get_feed(db, skip, limit, current_user, tag_ids)


@router.get("/market", response_model=list[PostResponse])
def get_market(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    tag_ids: list[int] | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user),
):
    return feed_service.get_market(db, skip, limit, current_user, tag_ids)


@router.get("/help", response_model=list[PostResponse])
def get_help_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    tag_ids: list[int] | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user),
):
    return feed_service.get_help_requests(db, skip, limit, current_user, tag_ids)


@router.get("/contracts", response_model=list[PostResponse])
def get_contracts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    tag_ids: list[int] | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user),
):
    return feed_service.get_contracts(db, skip, limit, current_user, tag_ids)