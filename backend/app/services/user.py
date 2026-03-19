from sqlalchemy.orm import Session
from app.models import User
from app.schemas.user import UpdateProfileRequest
from app.crud import user as user_crud
from app.core.exceptions import UsernameAlreadyExistsError, UserNotFoundError

def get_user(db: Session, user_id: int) -> User:
    user = user_crud.get_user_by_id(db, user_id)
    if not user:
        raise UserNotFoundError()
    return user

def update_profile(db: Session, data: UpdateProfileRequest, current_user: User) -> User:
    updates = data.model_dump(exclude_unset=True)

    if "username" in updates:
        existing = user_crud.get_user_by_username(db, updates["username"])
        if existing and existing.id != current_user.id:
            raise UsernameAlreadyExistsError()

    return user_crud.update_user(db, current_user, **updates)