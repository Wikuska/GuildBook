from sqlalchemy.orm import Session
from app.models import Post

def create_post(db: Session, post: Post) -> Post:
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

def get_posts(skip: int, limit: int, db: Session, race_id: int) -> list[Post]:
    return db.query(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()