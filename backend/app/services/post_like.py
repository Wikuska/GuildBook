from sqlalchemy.orm import Session
from app.models import User, PostLike
from app.schemas.post import PostLikeStatusResponse
from app.crud import post as post_crud
from app.crud import post_like as post_like_crud
from app.core.exceptions import PostNotFoundError

def _get_existing_like_for_accessible_post(
    db: Session,
    post_id: int,
    current_user: User,
) -> PostLike | None:
    post = post_crud.get_post_by_id(
        db=db,
        post_id=post_id,
        race_id=current_user.race_id,
        user_id=current_user.id,
        is_admin=current_user.is_admin,
    )
    if not post:
        raise PostNotFoundError()

    return post_like_crud.get_like(db, post_id=post_id, user_id=current_user.id)

def like_post(db: Session, post_id: int, current_user: User) -> PostLikeStatusResponse:
    existing_like = _get_existing_like_for_accessible_post(db, post_id, current_user)
    if existing_like is None:
        post_like_crud.create_like(db, post_id=post_id, user_id=current_user.id)

    db.commit()
    
    return PostLikeStatusResponse(
        post_id=post_id,
        likes_count=post_like_crud.count_post_likes(db, post_id),
        is_liked_by_current_user=True,
    )
    
def unlike_post(db: Session, post_id: int, current_user: User) -> PostLikeStatusResponse:
    existing_like = _get_existing_like_for_accessible_post(db, post_id, current_user)
    if existing_like is not None:
        post_like_crud.delete_like(db, existing_like)

    db.commit()

    return PostLikeStatusResponse(
        post_id=post_id,
        likes_count=post_like_crud.count_post_likes(db, post_id),
        is_liked_by_current_user=False,
    )
