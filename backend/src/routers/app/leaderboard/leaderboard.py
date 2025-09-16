from fastapi import Request, HTTPException, APIRouter, Query, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List, Optional
from pydantic import BaseModel

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

# Test endpoint for admin - directly update school scores
class TestSchoolScore(BaseModel):
    school_id: str
    score_to_add: int

@router.post('/test/school-score')
@error_decorator
async def test_add_school_score(
    req: Request,
    test_data: TestSchoolScore,
    user_id: str = Depends(auth.auth_wrapper)
):
    """Test endpoint: Add score directly to a school's leaderboard (Admin only)"""
    from crud.schools.schools import getSchoolById
    from crud._generic import _db_actions
    from models.leaderboard.leaderboard import SchoolLeaderboard
    from datetime import datetime, timezone
    
    # Get school info
    school = await getSchoolById(req, test_data.school_id)
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    
    # Get today's date
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    
    # Check if school already has an entry for today
    existing_entry = await _db_actions.getDocument(
        req=req,
        collection_name='school_leaderboard',
        BaseModel=SchoolLeaderboard,
        school_id=test_data.school_id,
        date=today
    )
    
    if existing_entry:
        # Update existing entry
        new_total = existing_entry.total_score + test_data.score_to_add
        await _db_actions.updateDocument(
            req=req,
            collection_name='school_leaderboard',
            BaseModel=SchoolLeaderboard,
            document_id=existing_entry.id,
            total_score=new_total,
            updated_at=datetime.now(timezone.utc)
        )
        existing_entry.total_score = new_total
        result_entry = existing_entry
    else:
        # Create new entry
        new_entry = SchoolLeaderboard(
            school_id=test_data.school_id,
            school_name=school.school_name,
            total_score=test_data.score_to_add,
            user_count=1,  # Fake user count for testing
            date=today
        )
        
        result_entry = await _db_actions.createDocument(
            req=req,
            collection_name='school_leaderboard',
            BaseModel=SchoolLeaderboard,
            new_document=new_entry
        )
    
    return JSONResponse(
        status_code=201,
        content=jsonable_encoder({
            "success": True,
            "school_entry": result_entry,
            "message": f"Added {test_data.score_to_add} points to {school.school_name}"
        })
    )