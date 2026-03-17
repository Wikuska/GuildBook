from sqlalchemy.orm import Session
from app.models import Comment


def create_comment(db: Session, comment: Comment) -> Comment:
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

def get_comment_by_id(db: Session, comment_id: int) -> Comment | None:
    return db.query(Comment).filter(Comment.id == comment_id).first()

def get_post_comments(db: Session, post_id: int) -> list[Comment]:
    return(
        db.query(Comment)
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.desc())
        .all())
