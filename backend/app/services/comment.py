from sqlalchemy.orm import Session
from app.models import User, Comment
from app.schemas.comment import CreateCommentRequest, UpdateCommentRequest
from app.crud import comment as comment_crud
from app.crud import post as post_crud
from app.core.exceptions import PostNotFoundError, CommentDeleteForbiddenError, CommentEditForbiddenError, CommentNotFoundError


def create_new_comment(db: Session, post_id: int, data: CreateCommentRequest, current_user: User) -> Comment:
    post = post_crud.get_post_by_id(db, post_id, current_user.race_id)
    if not post:
        raise PostNotFoundError()

    comment = Comment(
        content=data.content,
        post_id=post_id,
        author_id=current_user.id,
    )

    return comment_crud.create_comment(db, comment)

def get_post_comments(db: Session, post_id: int, current_user: User) -> list[Comment]:
    post = post_crud.get_post_by_id(db, post_id, current_user.race_id)
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
    
    return comment_crud.update_comment(db, comment, data.content)

def delete_comment(db: Session, comment_id: int, current_user: User) -> None:
    comment = comment_crud.get_comment_by_id(db, comment_id)
    if not comment:
        raise CommentNotFoundError()
    
    if comment.author_id != current_user.id and not current_user.is_admin:
        raise CommentDeleteForbiddenError()
    
    comment_crud.delete_comment(db, comment)