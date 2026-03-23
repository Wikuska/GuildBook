from sqlalchemy.orm import Session
from app.models import User
from app.schemas.user import UpdateProfileRequest, PublicUserResponse
from app.crud import user as user_crud
from app.crud import follow as follow_crud
from app.core.exceptions import UsernameAlreadyExistsError, UserNotFoundError

def build_public_user_response(db: Session, user: User, current_user: User) -> PublicUserResponse:
    return PublicUserResponse(
        id = user.id,
        username = user.username,
        race_id = user.race_id,
        bio = user.bio,
        avatar_url = user.avatar_url,
        banner_url = user.banner_url,
        location = user.location,
        followers_count = follow_crud.count_followers(db, user.id),
        following_count = follow_crud.count_following(db, user.id),
        is_followed_by_current_user = follow_crud.is_following(db, current_user.id, user.id)
    )

def get_user(db: Session, user_id: int, current_user: User) -> PublicUserResponse:
    user = user_crud.get_user_by_id(db, user_id)
    if not user:
        raise UserNotFoundError()
    return build_public_user_response(db, user, current_user)

def update_profile(db: Session, data: UpdateProfileRequest, current_user: User) -> PublicUserResponse:
    updates = data.model_dump(exclude_unset=True)

    if "username" in updates:
        existing = user_crud.get_user_by_username(db, updates["username"])
        if existing and existing.id != current_user.id:
            raise UsernameAlreadyExistsError()

    updated_user = user_crud.update_user(db, current_user, **updates)
    return build_public_user_response(db, updated_user, current_user)
