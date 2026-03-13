class AppException(Exception):
    status_code = 400
    detail = "Application error"

    def __init__(self, detail: str | None = None):
        if detail:
            self.detail = detail


class EmailAlreadyExistsError(AppException):
    status_code = 400
    detail = "Email already exists"

class UsernameAlreadyExistsError(AppException):
    status_code = 400
    detail = "Username already exists"

class InvalidCredentialsError(AppException):
    status_code = 401
    detail = "Invalid email or password"
    
class CategoryNotFoundError(AppException):
    status_code = 404
    detail = "Category not found"

class PostNotFoundError(AppException):
    status_code = 404
    detail = "Post not found"
    
class TagNotFoundError(AppException):
    status_code = 404
    detail = "Tag not found"   
