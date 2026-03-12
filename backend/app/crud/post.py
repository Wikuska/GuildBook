from sqlalchemy.orm import Session
from app.models import Post, PostVisibleRace

def create_post(db: Session, post: Post, visible_race_ids: list[int]) -> Post:
    db.add(post)
    db.flush()
    
    for race_id in visible_race_ids:
        db.add(PostVisibleRace(post_id=post.id, race_id=race_id))
    
    db.commit()
    db.refresh(post)
    return post

def get_posts(skip: int, limit: int, db: Session, race_id: int) -> list[Post]:
    return db.query(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

def get_post_by_id(db: Session, post_id: int) -> Post|None:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        return None
    return post
    