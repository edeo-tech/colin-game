from fastapi import APIRouter

from routers.app.users.auth.users import router as auth_router
from routers.app.users.auth.refresh import router as refresh_router

router = APIRouter()

router.include_router(auth_router, prefix='/auth', tags=['auth'])
router.include_router(refresh_router, prefix='/refresh', tags=['refresh'])
