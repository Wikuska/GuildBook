from app.models import User
from sqlalchemy.orm import Session
from app.schemas.me import UpdateProfileRequest, PrivateUserResponse, UserFeedResponse, ChangePasswordRequest, ChangeEmailRequest
from app.crud import user as user_crud
from app.crud import me as me_crud
from app.crud import follow as follow_crud
from app.core.exceptions import EmailAlreadyExistsError, IncorrectOldPasswordError, UsernameAlreadyExistsError
from app.services.user import _get_base_user_data
from app.services.auth import verify_password, hash_password

def build_private_user_response(db: Session, user: User) -> PrivateUserResponse:
    base_data = _get_base_user_data(db, user)

    base_data["email"] = user.email
    return PrivateUserResponse(**base_data)

def get_feed_profile(current_user: User, db: Session) -> UserFeedResponse:
    return UserFeedResponse (
        id=current_user.id,
        username=current_user.username,
        race=current_user.race,
        avatar_url=current_user.avatar_url,
        followers_count=follow_crud.count_followers(db, current_user.id),
        following_count=follow_crud.count_following(db, current_user.id)
    )
    
def update_profile(db: Session, data: UpdateProfileRequest, current_user: User) -> PrivateUserResponse:
    updates = data.model_dump(exclude_unset=True)

    if "username" in updates:
        existing = user_crud.get_user_by_username(db, updates["username"])
        if existing and existing.id != current_user.id:
            raise UsernameAlreadyExistsError()

    updated_user = me_crud.update_user(db, current_user, **updates)
    return build_private_user_response(db, updated_user)

def update_user_password(db: Session, data: ChangePasswordRequest, current_user: User):
    if not verify_password(data.old_password, current_user.password_hash):
        raise IncorrectOldPasswordError()
    
    current_user.password_hash = hash_password(data.new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}

def update_user_email(db: Session, data: ChangeEmailRequest, current_user: User):
    existing_user = db.query(User).filter(User.email == data.new_email).first()
    if existing_user:
        raise EmailAlreadyExistsError()

    current_user.email = data.new_email
    db.commit()
    
    return {"message": "Email updated successfully"}