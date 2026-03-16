from sqlalchemy.orm import Session
from app.models import Category

def get_category_by_id(db: Session, category_id: int) -> Category | None: 
    
    return db.query(Category).filter(Category.id == category_id).first()

def get_categories_by_ids(db: Session, category_ids: list[int]) -> list[Category]:
    if not category_ids:
        return []

    return db.query(Category).filter(Category.id.in_(category_ids)).all()