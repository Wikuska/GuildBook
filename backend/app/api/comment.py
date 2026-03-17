from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services import auth
from app.models import User
from app.services import comment as comment_service
from app.schemas.comment import CreateCommentRequest, CommentResponse, UpdateCommentRequest


post_comments_router = APIRouter(prefix="/posts", tags=["comments"])
comments_router = APIRouter(prefix="/comments", tags=["comments"])


@post_comments_router.post("/{post_id}/comments", status_code=status.HTTP_201_CREATED, response_model=CommentResponse)
def create_comment(
    post_id: int,
    comment: CreateCommentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    return comment_service.create_new_comment(db, post_id, comment, current_user)

@post_comments_router.get("/{post_id}/comments", response_model=list[CommentResponse])
def get_post_comments(post_id: int,
                 db: Session = Depends(get_db),
                 current_user: User = Depends(auth.get_current_user)):
    return comment_service.get_post_comments(db, post_id, current_user)

@comments_router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(
    comment_id: int,
    comment: UpdateCommentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return comment_service.update_comment(db, comment_id, comment, current_user)

@comments_router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    comment_service.delete_comment(db, comment_id, current_user)