from fastapi import APIRouter
from .questions import router as questions_router
from .answer_check import router as answer_check_router

router = APIRouter()

router.include_router(questions_router, prefix="", tags=["questions"])
router.include_router(answer_check_router, prefix="", tags=["questions"])