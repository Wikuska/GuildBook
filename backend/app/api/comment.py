from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services import auth
from app.models import User
from app.services import comment as comment_service
from app.schemas.comment import CreateCommentRequest, CommentResponse


router = APIRouter(prefix="/posts", tags=["comments"])


@router.post("/{post_id}/comments", status_code=status.HTTP_201_CREATED, response_model=CommentResponse)
def create_comment(
    post_id: int,
    comment: CreateCommentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    return comment_service.create_new_comment(db, post_id, comment, current_user)