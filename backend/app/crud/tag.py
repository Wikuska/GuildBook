from sqlalchemy.orm import Session
from app.models import Tag

def get_tags_by_ids(db: Session, tag_ids: list[int]) -> list[Tag]:
    if not tag_ids:
        return []
    return db.query(Tag).filter(Tag.id.in_(tag_ids)).all()

def count_tags_by_ids(db: Session, tag_ids: list[int]) -> int:
    if not tag_ids:
        return 0
    return db.query(Tag.id).filter(Tag.id.in_(tag_ids)).count()
