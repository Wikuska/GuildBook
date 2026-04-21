from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services import auth
from app.models import User
from app.services import user as user_service
from app.services import follow as follow_service
from app.schemas.user import UpdateProfileRequest, PublicUserResponse, FollowStatusResponse, PrivateUserResponse


router = APIRouter(prefix="/users", tags=["users"])


@router.patch("/me", response_model=PrivateUserResponse)
def update_profile(
    data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return user_service.update_profile(db, data, current_user)

@router.get("/{user_id}", response_model=PublicUserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user : User = Depends(auth.get_current_user),
):
    return user_service.get_user(db, user_id, current_user)

@router.post("/{user_id}/follow", response_model = FollowStatusResponse)
def follow_user(
    user_id:int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
) -> FollowStatusResponse:
    return follow_service.follow_user(db, user_id, current_user)

@router.delete("/{user_id}/follow", response_model = FollowStatusResponse)
def unfollow_user(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
) -> FollowStatusResponse:
    return follow_service.unfollow_user(db, user_id, current_user)