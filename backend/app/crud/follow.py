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
