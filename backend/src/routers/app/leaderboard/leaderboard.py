from fastapi import Request, HTTPException, APIRouter, Query, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List

from models.leaderboard.leaderboard import LeaderboardEntryCreate
from crud.leaderboard.leaderboard import (
    create_leaderboard_entry,
    get_all_time_leaderboard,
    get_daily_leaderboard,
    get_user_leaderboard_entries
)
from utils.__errors__.error_decorator_routes import error_decorator
from authentication import Authorization

router = APIRouter()
auth = Authorization()

@router.post('/create')
@error_decorator
async def create_leaderboard_entry_route(
    req: Request, 
    entry: LeaderboardEntryCreate,
    user_id: str = Depends(auth.auth_wrapper)
):
    """Create a new leaderboard entry"""
    # Ensure the user_id in the entry matches the authenticated user
    if entry.user_id != user_id:
        raise HTTPException(
            status_code=403, 
            detail="Cannot create leaderboard entry for another user"
        )
    
    created_entry = await create_leaderboard_entry(req, entry)
    return JSONResponse(
        status_code=201,
        content=jsonable_encoder(created_entry)
    )

@router.get('/all-time')
@error_decorator
async def get_all_time_leaderboard_route(
    req: Request,
    limit: int = Query(10, ge=1, le=50, description="Number of top entries to return"),
    user_id: str = Depends(auth.auth_wrapper)
):
    """Get the all-time leaderboard (highest score per unique user)"""
    leaderboard = await get_all_time_leaderboard(req, limit=limit)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder(leaderboard)
    )

@router.get('/daily')
@error_decorator
async def get_daily_leaderboard_route(
    req: Request,
    limit: int = Query(10, ge=1, le=50, description="Number of top entries to return"),
    user_id: str = Depends(auth.auth_wrapper)
):
    """Get today's leaderboard"""
    leaderboard = await get_daily_leaderboard(req, limit=limit)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder(leaderboard)
    )

@router.get('/user/{target_user_id}')
@error_decorator
async def get_user_leaderboard_entries_route(
    req: Request,
    target_user_id: str,
    limit: int = Query(10, ge=1, le=50, description="Number of entries to return"),
    user_id: str = Depends(auth.auth_wrapper)
):
    """Get a user's leaderboard entries"""
    entries = await get_user_leaderboard_entries(req, target_user_id, limit=limit)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder(entries)
    )