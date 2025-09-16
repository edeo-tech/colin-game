from fastapi import APIRouter

from routers.app.users._index import router as users_router
from routers.app.questions._index import router as questions_router
from routers.app.leaderboard._index import router as leaderboard_router
from routers.app.schools.schools import router as schools_router

router = APIRouter()

router.include_router(users_router, prefix='/users', tags=['users'])
router.include_router(questions_router, prefix='/questions', tags=['questions'])
router.include_router(leaderboard_router, prefix='/leaderboard', tags=['leaderboard'])
router.include_router(schools_router, prefix='/schools', tags=['schools'])
