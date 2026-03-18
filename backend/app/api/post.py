from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services import auth
from app.models import User
from app.services import post as post_service
from app.schemas.post import CreatePostRequest, PostResponse


router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=PostResponse)
def create_post(post: CreatePostRequest, db: Session = Depends(get_db), current_user: User = Depends(auth.get_current_user)):
    return post_service.create_new_post(db, post, current_user)

@router.get("/", response_model=list[PostResponse])
def get_posts(
    category_ids: list[int] | None = Query(None),
    tag_ids: list[int] | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    return post_service.get_posts(db, skip, limit, current_user, category_ids, tag_ids)

@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(auth.get_current_user)):
    return post_service.get_post(db, post_id, current_user)

@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    post: CreatePostRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    return post_service.update_post(db, post_id, post, current_user)

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    post_service.delete_post(db, post_id, current_user)
