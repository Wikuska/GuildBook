from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models import Race, Category, Tag

def seed_races(db: Session):
    races = ["Witcher", "Sorcerer", "Dwarf", "Elf", "Human"]
    for r in races:
        if not db.query(Race).filter_by(name=r).first():
            db.add(Race(name=r))


def seed_categories(db: Session):
    categories = [
        "discussion",
        "market"
        "help_request",
        "announcement",
        "event",
        "contracts",
    ]
    for c in categories:
        if not db.query(Category).filter_by(name=c).first():
            db.add(Category(name=c))


def seed_tags(db: Session):
    tags = [
        "alchemy",
        "weapon",
        "magic",
        "blacksmithing",
        "monsters",
    ]
    for t in tags:
        if not db.query(Tag).filter_by(name=t).first():
            db.add(Tag(name=t))


def run():
    db = SessionLocal()
    try:
        seed_races(db)
        seed_categories(db)
        seed_tags(db)
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    run()
