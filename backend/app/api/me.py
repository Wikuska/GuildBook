from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services import auth
from app.db.database import get_db
from app.services import me as me_services
from app.models import User
from app.schemas.me import UpdateProfileRequest, PrivateUserResponse, UserFeedResponse, ChangePasswordRequest, ChangeEmailRequest

router = APIRouter(
    prefix="/me",
    tags=["Current User Settings"]
)

@router.get("", response_model=PrivateUserResponse)
def get_me(current_user: User = Depends(auth.get_current_user)):
    return current_user

@router.patch("", response_model=PrivateUserResponse)
def update_profile(
    data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return me_services.update_profile(db, data, current_user)

@router.get("/feed-profile", response_model=UserFeedResponse)
def get_feed_profile(
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)):
    return me_services.get_feed_profile(current_user, db)

@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest, 
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return me_services.update_user_password(db, data, current_user)

@router.post("/change-email")
def change_email(
    data: ChangeEmailRequest, 
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return me_services.update_user_email(db, data, current_user)