from fastapi import Request, HTTPException, APIRouter, Query, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List, Optional

from models.leaderboard.leaderboard import ScoreSubmission
from crud.leaderboard.leaderboard import (
    process_quiz_score,
    get_national_all_time,
    get_national_by_date,
    get_school_all_time,
    get_school_by_date
)
from utils.__errors__.error_decorator_routes import error_decorator
from authentication import Authorization

router = APIRouter()
auth = Authorization()

# Score Submission Route
@router.post('/submit-score')
@error_decorator
async def submit_quiz_score(
    req: Request, 
    score_submission: ScoreSubmission,
    user_id: str = Depends(auth.auth_wrapper)
):
    """Submit a quiz score - creates national entry and updates school entry if applicable"""
    # Ensure the user_id in the submission matches the authenticated user
    if score_submission.user_id != user_id:
        raise HTTPException(
            status_code=403, 
            detail="Cannot submit score for another user"
        )
    
    result = await process_quiz_score(req, score_submission)
    
    if not result["success"]:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process quiz score: {'; '.join(result['errors'])}"
        )
    
    return JSONResponse(
        status_code=201,
        content=jsonable_encoder(result)
    )

# National Leaderboard Routes
@router.get('/national/all-time')
@error_decorator
async def get_national_all_time_route(
    req: Request,
    limit: Optional[int] = Query(None, ge=1, description="Number of top entries to return (no limit if not specified)"),
    user_id: str = Depends(auth.auth_wrapper)
):
    """Get the national all-time leaderboard (highest score per unique user)"""
    leaderboard = await get_national_all_time(req, limit=limit)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder(leaderboard)
    )

@router.get('/national/date/{date}')
@error_decorator
async def get_national_by_date_route(
    req: Request,
    date: str,
    limit: Optional[int] = Query(None, ge=1, description="Number of top entries to return (no limit if not specified)"),
    user_id: str = Depends(auth.auth_wrapper)
):
    """Get national leaderboard for a specific date (YYYY-MM-DD format)"""
    leaderboard = await get_national_by_date(req, date, limit=limit)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder(leaderboard)
    )

# School Leaderboard Routes
@router.get('/school/all-time')
@error_decorator
async def get_school_all_time_route(
    req: Request,
    limit: Optional[int] = Query(None, ge=1, description="Number of top entries to return (no limit if not specified)"),
    user_id: str = Depends(auth.auth_wrapper)
):
    """Get the school all-time leaderboard (sum of all daily totals per school)"""
    leaderboard = await get_school_all_time(req, limit=limit)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder(leaderboard)
    )

@router.get('/school/date/{date}')
@error_decorator
async def get_school_by_date_route(
    req: Request,
    date: str,
    limit: Optional[int] = Query(None, ge=1, description="Number of top entries to return (no limit if not specified)"),
    user_id: str = Depends(auth.auth_wrapper)
):
    """Get school leaderboard for a specific date (YYYY-MM-DD format)"""
    leaderboard = await get_school_by_date(req, date, limit=limit)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder(leaderboard)
    )