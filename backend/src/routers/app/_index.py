from fastapi import APIRouter

from routers.app.users._index import router as users_router
from routers.app.questions._index import router as questions_router

router = APIRouter()

router.include_router(users_router, prefix='/users', tags=['users'])
router.include_router(questions_router, prefix='/questions', tags=['questions'])
