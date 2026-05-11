from sqlalchemy.orm import Session
from app.models import Race

def get_races_by_ids(db: Session, race_ids: list[int]) -> list[Race]:
    if not race_ids:
        return []
    return db.query(Race).filter(Race.id.in_(race_ids)).all()

def get_all_races(db: Session) -> list[Race]:
    return db.query(Race).all()