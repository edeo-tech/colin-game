from fastapi import APIRouter
from .questions import router as questions_router

router = APIRouter()

router.include_router(questions_router, prefix="", tags=["questions"])