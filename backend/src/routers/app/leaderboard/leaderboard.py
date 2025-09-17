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
    get_school_by_date,
    add_bonus_points_to_entry,
    delete_leaderboard_entry
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

# Admin Models
class BonusPointsRequest(BaseModel):
    entry_id: str
    bonus_points: int
    entry_type: str  # "national" or "school"

class DeleteEntryRequest(BaseModel):
    entry_id: str
    entry_type: str  # "national" or "school"

# Admin Endpoints
@router.post('/admin/bonus-points')
@error_decorator
async def add_bonus_points(
    req: Request,
    bonus_data: BonusPointsRequest,
    user_id: str = Depends(auth.auth_wrapper)
):
    """Add bonus points to a leaderboard entry (Admin only)"""
    print(f"Adding bonus points to entry {bonus_data.entry_id} with {bonus_data.bonus_points} points, leaderboard type {bonus_data.entry_type}")
    
    # Check if user is admin
    is_admin = await auth.check_admin_role(req, user_id)
    if not is_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    
    # Validate entry type
    if bonus_data.entry_type not in ["national", "school"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid entry type. Must be 'national' or 'school'"
        )
    
    result = await add_bonus_points_to_entry(
        req=req,
        entry_id=bonus_data.entry_id,
        bonus_points=bonus_data.bonus_points,
        entry_type=bonus_data.entry_type
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=404 if "not found" in "; ".join(result["errors"]).lower() else 500,
            detail=f"Failed to add bonus points: {'; '.join(result['errors'])}"
        )
    
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder(result)
    )

@router.delete('/admin/entry')
@error_decorator
async def delete_entry(
    req: Request,
    delete_data: DeleteEntryRequest,
    user_id: str = Depends(auth.auth_wrapper)
):
    """Delete a leaderboard entry (Admin only)"""
    
    print("Delete endpoint called")
    print(f"Delete data received: {delete_data}")
    print(f"Entry ID: {delete_data.entry_id}")
    print(f"Entry type: {delete_data.entry_type}")
    
    # Check if user is admin
    is_admin = await auth.check_admin_role(req, user_id)
    if not is_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    
    # Validate entry type
    if delete_data.entry_type not in ["national", "school"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid entry type. Must be 'national' or 'school'"
        )
    
    result = await delete_leaderboard_entry(
        req=req,
        entry_id=delete_data.entry_id,
        entry_type=delete_data.entry_type
    )

    print("--------------------------------")
    print("Result:", result)
    print("--------------------------------")
    if not result["success"]:
        raise HTTPException(
            status_code=404 if "not found" in "; ".join(result["errors"]).lower() else 500,
            detail=f"Failed to delete entry: {'; '.join(result['errors'])}"
        )
    
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder(result)
    )