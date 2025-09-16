from fastapi import Request, HTTPException
from typing import List
from datetime import datetime, timezone

from models.leaderboard.leaderboard import LeaderboardEntry, LeaderboardEntryCreate
from crud._generic import _db_actions

async def create_leaderboard_entry(req: Request, entry_data: LeaderboardEntryCreate) -> dict:
    """Create a new leaderboard entry"""
    
    # Convert to LeaderboardEntry model
    leaderboard_entry = LeaderboardEntry(**entry_data.model_dump())
    
    # Create the entry
    created_entry = await _db_actions.createDocument(
        req=req,
        collection_name='leaderboard',
        BaseModel=LeaderboardEntry,
        new_document=leaderboard_entry
    )
    
    return created_entry

async def get_all_time_leaderboard(req: Request, limit: int = 10) -> List[dict]:
    """Get top scores of all time from unique users (highest score per user)"""
    
    # Use MongoDB aggregation to get the highest score per user
    pipeline = [
        # Group by user_id and get the maximum score for each user
        {
            "$group": {
                "_id": "$user_id",
                "max_score": {"$max": "$score"},
                "username": {"$first": "$username"},
                "user_id": {"$first": "$user_id"},
                "created_at": {"$first": "$created_at"},
                "updated_at": {"$first": "$updated_at"}
            }
        },
        # Sort by max_score in descending order
        {"$sort": {"max_score": -1}},
        # Limit to top results
        {"$limit": limit},
        # Reshape the output
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "username": 1,
                "user_id": 1,
                "score": "$max_score",
                "created_at": 1,
                "updated_at": 1
            }
        }
    ]
    
    # Execute aggregation
    results = await req.app.mongodb['leaderboard'].aggregate(pipeline).to_list(length=None)
    
    return results

async def get_daily_leaderboard(req: Request, limit: int = 10) -> List[dict]:
    """Get top 10 scores for today"""
    
    # Get start of today in UTC
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Get entries from today, sorted by score descending
    entries = await _db_actions.getMultipleDocuments(
        req=req,
        collection_name='leaderboard',
        BaseModel=LeaderboardEntry,
        order_by='score',
        order_direction=_db_actions.SortDirection.DESCENDING,
        limit=limit,
        skip=0,
        created_at={'$gte': today}  # Filter for entries created today or later
    )
    
    # Convert to dict format
    return [entry.model_dump() if hasattr(entry, 'model_dump') else entry for entry in entries]

async def get_user_leaderboard_entries(req: Request, user_id: str, limit: int = 10) -> List[dict]:
    """Get a user's recent leaderboard entries"""
    
    entries = await _db_actions.getMultipleDocuments(
        req=req,
        collection_name='leaderboard',
        BaseModel=LeaderboardEntry,
        order_by='created_at',
        order_direction=_db_actions.SortDirection.DESCENDING,
        limit=limit,
        skip=0,
        user_id=user_id
    )
    
    # Convert to dict format
    return [entry.model_dump() if hasattr(entry, 'model_dump') else entry for entry in entries]