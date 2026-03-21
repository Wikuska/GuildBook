from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models import PostLike

def get_like(db: Session, post_id: int, user_id: int) -> PostLike | None:
    return (
        db.query(PostLike)
        .filter(PostLike.post_id == post_id, PostLike.user_id == user_id)
        .first()
    )
    
def get_post_likes_count_map(db: Session, post_ids: list[int]) -> dict[int, int]:
    if not post_ids:
        return {}

    rows = (
        db.query(PostLike.post_id, func.count(PostLike.user_id))
        .filter(PostLike.post_id.in_(post_ids))
        .group_by(PostLike.post_id)
        .all()
    )

    return {post_id: likes_count for post_id, likes_count in rows}

def get_liked_post_ids_for_user(db: Session, post_ids: list[int], user_id: int) -> set[int]:
    if not post_ids:
        return set()

    rows = (
        db.query(PostLike.post_id)
        .filter(
            PostLike.post_id.in_(post_ids),
            PostLike.user_id == user_id,
        )
        .all()
    )

    return {post_id for (post_id,) in rows}
    
def create_like(db: Session, post_id: int, user_id: int) -> PostLike:
    post_like = PostLike(post_id = post_id, user_id = user_id)
    db.add(post_like)
    db.flush()
    return post_like

def delete_like(db: Session, post_like: PostLike) -> None:
    db.delete(post_like)
    db.flush()
    
def count_post_likes(db: Session, post_id: int) -> int:
    return (
        db.query(PostLike)
        .filter(PostLike.post_id == post_id)
        .count()
    )
    
def is_post_liked_by_user(db: Session, post_id: int, user_id: int) -> bool:
    return (
    db.query(PostLike)
    .filter(PostLike.post_id == post_id, PostLike.user_id == user_id)
    .first()
    is not None
)