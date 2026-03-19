from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.post import router as post_router
from app.api.feed import router as feed_router
from app.api.comment import post_comments_router as post_comment_router
from app.api.comment import comments_router as comment_router
from app.api.message import router as message_router
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.core.exceptions import AppException

app = FastAPI(title="GuildBook API")
app.include_router(post_router)
app.include_router(post_comment_router)
app.include_router(comment_router)
app.include_router(message_router)
app.include_router(auth_router)
app.include_router(feed_router)

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )
