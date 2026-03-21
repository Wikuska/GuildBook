from sqlalchemy.orm import Session
from app.models import User, Post, Comment

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email, User.is_deleted == False).first()

def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username, User.is_deleted == False).first()

def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id, User.is_deleted == False).first()

def create_user(db: Session, username: str, email: str, hashed_password: str, race_id: int) -> User:
    user = User(
        username=username,
        email=email,
        password_hash=hashed_password,
        race_id=race_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update_user(db: Session, user: User, **kwargs) -> User:
    for key, value in kwargs.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user
