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

class UserNotFoundError(AppException):
    status_code = 404
    detail = "User not found"
    
class PostNotFoundError(AppException):
    status_code = 404
    detail = "Post not found"
    
class PostEditForbiddenError(AppException):
    status_code = 403
    detail = "Only author of the post can edit it"

class PostDeleteForbiddenError(AppException):
    status_code = 403
    detail = "Only author of the post and admin can delete it"
    
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
    
class CommentNotFoundError(AppException):
    status_code = 404
    detail = "Comment not found"
    
class CommentEditForbiddenError(AppException):
    status_code = 403
    detail = "Only comment author can make changes"
    
class CommentDeleteForbiddenError(AppException):
    status_code = 403
    detail = "Only comment author and admin can delete"

class CannotMessageYourselfError(AppException):
    status_code = 400
    detail = "You cannot send a message to yourself"
    
class ConversationNotFoundError(AppException):
    status_code = 404
    detail = "Conversation not found"

class UnauthorizedConversationError(AppException):
    status_code = 403
    detail = "You are not a participant of this conversation"

class SelfFollowNotAllowedError(AppException):
    status_code = 403
    detail = "You cannon follow yourself"
    
class NotificationNotFoundError(AppException):
    status_code = 404
    detail = "Notification not found"