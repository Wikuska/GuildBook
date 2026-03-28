# api/lookup.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services import auth as auth_service
from app.models import User, Tag, Category, Race
from app.schemas.post import TagResponse, CategoryResponse, RaceResponse

router = APIRouter(prefix="/lookup", tags=["lookup"])


@router.get("/tags", response_model=list[TagResponse])
def get_tags(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user),
):
    return db.query(Tag).order_by(Tag.name).all()


@router.get("/categories", response_model=list[CategoryResponse])
def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user),
):
    return db.query(Category).order_by(Category.name).all()


@router.get("/races", response_model=list[RaceResponse])
def get_races(
    db: Session = Depends(get_db)
):
    return db.query(Race).order_by(Race.name).all()