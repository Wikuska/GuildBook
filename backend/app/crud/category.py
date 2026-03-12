from sqlalchemy.orm import Session
from app.models import Category

def get_category_by_id(db: Session, category_id: int) -> Category | None:
    return db.query(Category).filter(Category.id == category_id).first()