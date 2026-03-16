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
    
class PostNotFoundError(AppException):
    status_code = 404
    detail = "Post not found"
    
class CategoryNotFoundError(AppException):
    status_code = 404
    detail = "Category not found"

class InvalidCategoryFilterError(AppException):
    status_code = 400
    detail = "Category filter contains invalid or non-existing ids"

class TagNotFoundError(AppException):
    status_code = 404
    detail = "Tag not found"   

class InvalidTagFilterError(AppException):
    status_code = 400
    detail = "Tag filter contains invalid or non-existing ids"