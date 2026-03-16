from sqlalchemy.orm import Session
from app.models import User, Comment
from app.schemas.comment import CreateCommentRequest
from app.crud import comment as comment_crud
from app.crud import post as post_crud
from app.core.exceptions import PostNotFoundError


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
