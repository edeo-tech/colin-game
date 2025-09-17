from fastapi import Request, HTTPException
from typing import List, Optional
from datetime import datetime, timezone
from dateutil import parser

from models.leaderboard.leaderboard import NationalLeaderboard, SchoolLeaderboard, ScoreSubmission
from models.schools.school import School
from crud._generic import _db_actions

# National Leaderboard Functions
async def create_national_entry(req: Request, user_id: str, username: str, score: int) -> NationalLeaderboard:
    """Create a new national leaderboard entry"""
    
    entry = NationalLeaderboard(
        user_id=user_id,
        username=username,
        score=score
    )
    
    created_entry = await _db_actions.createDocument(
        req=req,
        collection_name='national_leaderboard',
        BaseModel=NationalLeaderboard,
        new_document=entry
    )
    
    return created_entry

async def get_national_all_time(req: Request, limit: Optional[int] = None) -> List[dict]:
    """Get highest score per user for all time"""
    
    pipeline = [
        # Group by user_id and get the document with maximum score for each user
        {
            "$group": {
                "_id": "$user_id",
                "top_score_doc": {
                    "$top": {
                        "output": {
                            "score": "$score",
                            "id": "$_id",
                            "username": "$username",
                            "user_id": "$user_id",
                            "created_at": "$created_at",
                            "updated_at": "$updated_at"
                        },
                        "sortBy": {"score": -1}
                    }
                }
            }
        },
        # Flatten the structure
        {
            "$replaceRoot": {
                "newRoot": {
                    "_id": "$_id",
                    "max_score": "$top_score_doc.score",
                    "username": "$top_score_doc.username",
                    "user_id": "$top_score_doc.user_id",
                    "id": "$top_score_doc.id",
                    "created_at": "$top_score_doc.created_at",
                    "updated_at": "$top_score_doc.updated_at"
                }
            }
        },
        # Sort by max_score in descending order
        {"$sort": {"max_score": -1}},
        # Reshape the output
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "username": 1,
                "user_id": 1,
                "id": 1,
                "score": "$max_score",
                "created_at": 1,
                "updated_at": 1
            }
        }
    ]
    
    # Add limit if specified
    if limit:
        pipeline.insert(-1, {"$limit": limit})
    
    results = await req.app.mongodb['national_leaderboard'].aggregate(pipeline).to_list(length=None)
    return results

async def get_national_by_date(req: Request, date_str: str, limit: Optional[int] = None) -> List[dict]:
    """Get highest score per user for a specific date"""
    
    # Parse the date string and create start/end of day
    try:
        target_date = parser.parse(date_str).replace(tzinfo=timezone.utc)
        start_of_day = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = target_date.replace(hour=23, minute=59, second=59, microsecond=999999)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    pipeline = [
        # Filter by date range
        {
            "$match": {
                "created_at": {
                    "$gte": start_of_day,
                    "$lte": end_of_day
                }
            }
        },
        # Group by user_id and get the document with maximum score for each user on this date
        {
            "$group": {
                "_id": "$user_id",
                "top_score_doc": {
                    "$top": {
                        "output": {
                            "score": "$score",
                            "id": "$_id",
                            "username": "$username",
                            "user_id": "$user_id",
                            "created_at": "$created_at",
                            "updated_at": "$updated_at"
                        },
                        "sortBy": {"score": -1}
                    }
                }
            }
        },
        # Flatten the structure
        {
            "$replaceRoot": {
                "newRoot": {
                    "_id": "$_id",
                    "max_score": "$top_score_doc.score",
                    "username": "$top_score_doc.username",
                    "user_id": "$top_score_doc.user_id",
                    "id": "$top_score_doc.id",
                    "created_at": "$top_score_doc.created_at",
                    "updated_at": "$top_score_doc.updated_at"
                }
            }
        },
        # Sort by max_score in descending order
        {"$sort": {"max_score": -1}},
        # Reshape the output
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "username": 1,
                "user_id": 1,
                "id": 1,
                "score": "$max_score",
                "created_at": 1,
                "updated_at": 1
            }
        }
    ]
    
    # Add limit if specified
    if limit:
        pipeline.insert(-1, {"$limit": limit})
    
    results = await req.app.mongodb['national_leaderboard'].aggregate(pipeline).to_list(length=None)
    return results

# School Leaderboard Functions
async def create_or_update_school_entry(req: Request, school_id: str, school_name: str, user_score: int) -> SchoolLeaderboard:
    """Create a new school leaderboard entry for today or update existing one"""
    
    # Get start of today in UTC
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow = today.replace(hour=23, minute=59, second=59, microsecond=999999)
    
    # Check if there's already an entry for this school today
    existing_entry = await req.app.mongodb['school_leaderboard'].find_one({
        'school_id': school_id,
        'created_at': {
            '$gte': today,
            '$lte': tomorrow
        }
    })
    
    if existing_entry:
        # Update existing entry
        updated_entry = await _db_actions.updateDocument(
            req=req,
            collection_name='school_leaderboard',
            BaseModel=SchoolLeaderboard,
            document_id=existing_entry['_id'],
            total_score=existing_entry['total_score'] + user_score,
            user_count=existing_entry['user_count'] + 1
        )
        return updated_entry
    else:
        # Create new entry for today
        entry = SchoolLeaderboard(
            school_id=school_id,
            school_name=school_name,
            total_score=user_score,
            user_count=1
        )
        
        created_entry = await _db_actions.createDocument(
            req=req,
            collection_name='school_leaderboard',
            BaseModel=SchoolLeaderboard,
            new_document=entry
        )
        return created_entry

async def get_school_all_time(req: Request, limit: Optional[int] = None) -> List[dict]:
    """Get all-time school leaderboard (sum of all daily totals per school)"""
    
    pipeline = [
        # Sort by created_at to ensure consistent ordering for $first
        {"$sort": {"created_at": 1}},
        # Group by school_id and sum all daily totals
        {
            "$group": {
                "_id": "$school_id",
                "total_score": {"$sum": "$total_score"},
                "total_user_count": {"$sum": "$user_count"},
                "school_name": {"$first": "$school_name"},
                "school_id": {"$first": "$school_id"},
                "id": {"$first": "$_id"},  # This will be the first (oldest) document's ID
                "created_at": {"$first": "$created_at"},
                "updated_at": {"$first": "$updated_at"}
            }
        },
        # Lookup school details to get county
        {
            "$lookup": {
                "from": "schools",
                "let": {"schoolIdStr": "$school_id"},
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$or": [
                                    {"$eq": ["$_id", {"$toObjectId": "$$schoolIdStr"}]},
                                    {"$eq": [{"$toString": "$_id"}, "$$schoolIdStr"]}
                                ]
                            }
                        }
                    },
                    {"$project": {"county": 1}}
                ],
                "as": "school_details"
            }
        },
        # Add county field from lookup result
        {
            "$addFields": {
                "county": {"$arrayElemAt": ["$school_details.county", 0]}
            }
        },
        # Sort by total_score in descending order
        {"$sort": {"total_score": -1}},
        # Reshape the output
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "school_id": 1,
                "school_name": 1,
                "county": 1,
                "id": 1,
                "total_score": 1,
                "user_count": "$total_user_count",
                "created_at": 1,
                "updated_at": 1
            }
        }
    ]
    
    # Add limit if specified
    if limit:
        pipeline.insert(-1, {"$limit": limit})
    
    results = await req.app.mongodb['school_leaderboard'].aggregate(pipeline).to_list(length=None)
    
    # Debug: Print first result to see what's happening
    if results:
        print("get_school_all_time - First result with county lookup:")
        print(results[0])
    
    return results

async def get_school_by_date(req: Request, date_str: str, limit: Optional[int] = None) -> List[dict]:
    """Get school leaderboard for a specific date"""
    
    # Parse the date string and create start/end of day
    try:
        target_date = parser.parse(date_str).replace(tzinfo=timezone.utc)
        start_of_day = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = target_date.replace(hour=23, minute=59, second=59, microsecond=999999)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Use aggregation pipeline to include county information
    pipeline = [
        # Filter by date range
        {
            "$match": {
                "created_at": {
                    "$gte": start_of_day,
                    "$lte": end_of_day
                }
            }
        },
        # Lookup school details to get county
        {
            "$lookup": {
                "from": "schools",
                "let": {"schoolIdStr": "$school_id"},
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$or": [
                                    {"$eq": ["$_id", {"$toObjectId": "$$schoolIdStr"}]},
                                    {"$eq": [{"$toString": "$_id"}, "$$schoolIdStr"]}
                                ]
                            }
                        }
                    },
                    {"$project": {"county": 1}}
                ],
                "as": "school_details"
            }
        },
        # Add county field from lookup result
        {
            "$addFields": {
                "county": {"$arrayElemAt": ["$school_details.county", 0]}
            }
        },
        # Sort by total_score in descending order
        {"$sort": {"total_score": -1}},
        # Reshape the output
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "school_id": 1,
                "school_name": 1,
                "county": 1,
                "id": 1,
                "total_score": 1,
                "user_count": 1,
                "created_at": 1,
                "updated_at": 1
            }
        }
    ]
    
    # Add limit if specified
    if limit:
        pipeline.append({"$limit": limit})
    
    results = await req.app.mongodb['school_leaderboard'].aggregate(pipeline).to_list(length=None)
    
    # Debug: Print first result to see what's happening
    if results:
        print("get_school_by_date - First result with county lookup:")
        print(results[0])
    
    return results

# Combined Score Processing Function
async def process_quiz_score(req: Request, score_submission: ScoreSubmission) -> dict:
    """Process a quiz completion by creating national entry and updating school entry if applicable"""
    
    result = {
        "national_entry": None,
        "school_entry": None,
        "success": True,
        "errors": []
    }
    
    try:
        # Always create national leaderboard entry
        national_entry = await create_national_entry(
            req=req,
            user_id=score_submission.user_id,
            username=score_submission.username,
            score=score_submission.score
        )
        result["national_entry"] = national_entry

        # Check if user has a school by fetching their user document
        from models.users.users import User
        user = await _db_actions.getDocument(
            req=req,
            collection_name="users",
            BaseModel=User,
            id=score_submission.user_id
        )
        
        print("--------------------------------")
        print("Score submission school id:", score_submission.school_id)
        print("User school id from document:", user.school_id if user else None)
        
        # Use school_id from user document if available
        user_school_id = None
        if user and user.school_id:
            user_school_id = user.school_id
        elif score_submission.school_id:
            user_school_id = score_submission.school_id
            
        if user_school_id:
            # Get school name from schools collection
            school = await _db_actions.getDocument(
                req=req,
                collection_name="schools",
                BaseModel=School,
                id=user_school_id
            )
            
            if school:
                school_entry = await create_or_update_school_entry(
                    req=req,
                    school_id=user_school_id,
                    school_name=school.school_name,
                    user_score=score_submission.score
                )
                result["school_entry"] = school_entry
                print("Created/updated school entry for:", school.school_name)
            else:
                result["errors"].append(f"School with ID {user_school_id} not found")
                print("School not found for ID:", user_school_id)
        else:
            print("User has no school_id")
                
    except Exception as e:
        result["success"] = False
        result["errors"].append(str(e))
    
    return result

# Admin Functions
async def add_bonus_points_to_entry(req: Request, entry_id: str, bonus_points: int, entry_type: str) -> dict:
    """Add bonus points to a leaderboard entry (admin only)"""
    
    result = {
        "success": True,
        "updated_entry": None,
        "errors": []
    }
    
    try:
        if entry_type == "national":
            # Get the current entry
            existing_entry = await _db_actions.getDocument(
                req=req,
                collection_name='national_leaderboard',
                BaseModel=NationalLeaderboard,
                id=entry_id
            )
            
            if not existing_entry:
                result["success"] = False
                result["errors"].append("National leaderboard entry not found")
                return result
            
            # Update with bonus points
            new_score = existing_entry.score + bonus_points
            updated_entry = await _db_actions.updateDocument(
                req=req,
                collection_name='national_leaderboard',
                BaseModel=NationalLeaderboard,
                document_id=entry_id,
                score=new_score,
                updated_at=datetime.now(timezone.utc)
            )
            result["updated_entry"] = updated_entry
            
        elif entry_type == "school":
            # Get the current entry
            existing_entry = await _db_actions.getDocument(
                req=req,
                collection_name='school_leaderboard',
                BaseModel=SchoolLeaderboard,
                id=entry_id
            )
            
            if not existing_entry:
                result["success"] = False
                result["errors"].append("School leaderboard entry not found")
                return result
            
            # Update with bonus points
            new_total_score = existing_entry.total_score + bonus_points
            updated_entry = await _db_actions.updateDocument(
                req=req,
                collection_name='school_leaderboard',
                BaseModel=SchoolLeaderboard,
                document_id=entry_id,
                total_score=new_total_score,
                updated_at=datetime.now(timezone.utc)
            )
            result["updated_entry"] = updated_entry
            
        else:
            result["success"] = False
            result["errors"].append("Invalid entry type. Must be 'national' or 'school'")
            
    except Exception as e:
        result["success"] = False
        result["errors"].append(str(e))
    
    print("--------------------------------")
    print("Result:", result)
    print("--------------------------------")
    return result

async def delete_leaderboard_entry(req: Request, entry_id: str, entry_type: str) -> dict:
    """Delete a leaderboard entry (admin only)"""
    
    print(f"delete_leaderboard_entry called with entry_id: {entry_id}, type: {type(entry_id)}")
    print(f"entry_type: {entry_type}")
    
    result = {
        "success": True,
        "deleted_entry_id": entry_id,
        "errors": []
    }
    
    try:
        if entry_type == "national":
            # Check if entry exists
            existing_entry = await _db_actions.getDocument(
                req=req,
                collection_name='national_leaderboard',
                BaseModel=NationalLeaderboard,
                id=entry_id
            )
            
            if not existing_entry:
                result["success"] = False
                result["errors"].append("National leaderboard entry not found")
                return result
            
            # Delete the entry
            await _db_actions.deleteDocument(
                req=req,
                collection_name='national_leaderboard',
                BaseModel=NationalLeaderboard,
                id=entry_id
            )
            
        elif entry_type == "school":
            # Check if entry exists
            print("entry_id:", entry_id)
            existing_entry = await _db_actions.getDocument(
                req=req,
                collection_name='school_leaderboard',
                BaseModel=SchoolLeaderboard,
                id=entry_id
            )
            
            if not existing_entry:
                result["success"] = False
                result["errors"].append("School leaderboard entry not found")
                return result
            
            # Delete the entry
            await _db_actions.deleteDocument(
                req=req,
                collection_name='school_leaderboard',
                BaseModel=SchoolLeaderboard,
                id=entry_id
            )
            
        else:
            result["success"] = False
            result["errors"].append("Invalid entry type. Must be 'national' or 'school'")
            
    except Exception as e:
        result["success"] = False
        result["errors"].append(str(e))
    
    return result