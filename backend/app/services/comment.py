from sqlalchemy.orm import Session
from fastapi import BackgroundTasks
from app.models import User, Comment, NotificationType
from app.schemas.comment import CreateCommentRequest, UpdateCommentRequest
from app.crud import comment as comment_crud
from app.crud import post as post_crud
from app.crud import notification as notification_crud
from app.services.sse_service import broadcast_to_user
from app.core.exceptions import PostNotFoundError, CommentDeleteForbiddenError, CommentEditForbiddenError, CommentNotFoundError


def create_new_comment(db: Session, post_id: int, data: CreateCommentRequest, current_user: User, background_tasks: BackgroundTasks) -> Comment:
    post = post_crud.get_post_by_id(db, post_id, current_user.race_id, current_user.id, current_user.is_admin)
    if not post:
        raise PostNotFoundError()

    comment = comment_crud.create_comment(
        db,
        Comment(
        content=data.content,
        post_id=post_id,
        author_id=current_user.id,
    ))

    notification_crud.create_notification(
    db,
    recipient_id=post.author_id,
    actor_id=current_user.id,
    notification_type=NotificationType.post_comment,
    post_id=post_id,
    )
    
    if post.author_id != current_user.id:
        background_tasks.add_task(
            broadcast_to_user,
            user_id=post.author_id,
            event_type="notification",
            payload={
                "action": "post_comment",
                "post_id": post_id,
                "comment_id": comment.id,
                "actor_name": current_user.username
            }
        )
    
    db.commit()
    return comment
    
def get_post_comments(db: Session, post_id: int, current_user: User) -> list[Comment]:
    post = post_crud.get_post_by_id(db, post_id, current_user.race_id, current_user.id, current_user.is_admin)
    if not post:
        raise PostNotFoundError()
    
    return comment_crud.get_post_comments(db, post_id)

def update_comment(
    db: Session,
    comment_id: int,
    data: UpdateCommentRequest,
    current_user: User
) -> Comment:
    
    comment = comment_crud.get_comment_by_id(db, comment_id)
    if not comment:
        raise CommentNotFoundError()
    
    if comment.author_id != current_user.id:
        raise CommentEditForbiddenError()
    
    updated = comment_crud.update_comment(db, comment, data.content)
    db.commit()
    return updated

def delete_comment(db: Session, comment_id: int, current_user: User) -> None:
    comment = comment_crud.get_comment_by_id(db, comment_id)
    if not comment:
        raise CommentNotFoundError()
    
    if comment.author_id != current_user.id and not current_user.is_admin:
        raise CommentDeleteForbiddenError()
    
    comment_crud.delete_comment(db, comment)
    db.commit()