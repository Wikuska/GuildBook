from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models import Comment


def create_comment(db: Session, comment: Comment) -> Comment:
    db.add(comment)
    db.flush()
    return comment

def get_comment_by_id(db: Session, comment_id: int) -> Comment | None:
    return db.query(Comment).filter(Comment.id == comment_id).first()

def get_post_comments(db: Session, post_id: int) -> list[Comment]:
    return(
        db.query(Comment)
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.desc())
        .all())

def update_comment(db: Session, comment: Comment, content: str) -> Comment:
    comment.content = content
    db.flush()
    return comment

def delete_comment(db: Session, comment: Comment) -> None:
    db.delete(comment)
    db.flush()
    
def count_post_comments(db: Session, post_id: int) -> int:
    return db.query(Comment).filter(Comment.post_id == post_id).count()

def get_comments_count_map(db: Session, post_ids: list[int]) -> dict[int, int]:
    rows = (
        db.query(Comment.post_id, func.count(Comment.id))
        .filter(Comment.post_id.in_(post_ids))
        .group_by(Comment.post_id)
        .all()
    )
    return {post_id: count for post_id, count in rows}