from sqlalchemy.orm import Session
from app.models import UserFollow

def get_follow(db: Session, follower_id: int, followed_id: int) -> UserFollow | None:
    return (
        db.query(UserFollow)
        .filter(
            UserFollow.follower_id == follower_id,
            UserFollow.followed_id == followed_id,
        )
        .first()
    )
    
def create_follow(db: Session, follower_id: int, followed_id: int) -> UserFollow:
    follow = UserFollow(
        follower_id = follower_id,
        followed_id = followed_id
    )
    db.add(follow)
    db.flush()
    return follow

def delete_follow(db: Session, follow: UserFollow) -> None:
    db.delete(follow)
    db.flush()
    
def count_followers(db: Session, user_id: int) -> int:
    return (
        db.query(UserFollow)
        .filter(UserFollow.followed_id == user_id)
        .count()
    )
    
def count_following(db: Session, user_id: int) -> int:
    return (
        db.query(UserFollow)
        .filter(UserFollow.follower_id == user_id)
        .count()
    )
    
def get_followed_user_ids(db: Session, user_id: int) -> list[int]:
    rows = (
        db.query(UserFollow.followed_id)
        .filter(UserFollow.follower_id == user_id)
        .all()
    )
    return [row.followed_id for row in rows]
    
def is_following(db: Session, follower_id: int, followed_id: int) -> bool:
    return (
        db.query(UserFollow)
        .filter(
            UserFollow.follower_id == follower_id,
            UserFollow.followed_id == followed_id,
        )
        .first()
        is not None
    )