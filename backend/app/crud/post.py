from sqlalchemy.orm import Session
from app.models import Post

def create_post(db: Session, post: Post) -> Post:
    db.add(post)
    db.commit()
    db.refresh(post)
    return post