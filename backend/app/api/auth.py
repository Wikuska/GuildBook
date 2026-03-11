from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserMeResponse
from app.services import auth
from app.models import User
from app.core.security import create_access_token


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    user = auth.register_new_user(db, data)
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "race_id": user.race_id,
    }

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, data.email, data.password)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)

@router.get("/me", response_model=UserMeResponse)
def get_me(current_user: User = Depends(auth.get_current_user)):
    return current_user
