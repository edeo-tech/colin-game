from fastapi import APIRouter, Request, HTTPException
from typing import List, Optional
from pydantic import BaseModel

from models.schools.school import School
from crud.schools.schools import (
    createSchool,
    createMultipleSchools,
    getAllSchools,
    getSchoolById,
    getSchoolsByCounty,
    getSchoolsByCountry,
    countSchools
)
from utils.__errors__.error_decorator_routes import error_decorator


class SchoolCreateRequest(BaseModel):
    school_name: str
    county: str
    country: str


class BulkSchoolsCreateRequest(BaseModel):
    schools: List[SchoolCreateRequest]


router = APIRouter(tags=["Schools"])


@router.get("/", response_model=List[School])
@error_decorator
async def get_all_schools(
    req: Request,
    county: Optional[str] = None,
    country: Optional[str] = None,
    limit: Optional[int] = 0
):
    """Get all schools, optionally filtered by county or country"""
    
    # If filters are provided, use specific query functions
    if county:
        schools = await getSchoolsByCounty(
            req,
            county=county,
            limit=limit
        )
    elif country:
        schools = await getSchoolsByCountry(
            req,
            country=country,
            limit=limit
        )
    else:
        # Get all schools
        schools = await getAllSchools(
            req,
            limit=limit
        )
    
    return schools


@router.post("/", response_model=School)
@error_decorator
async def create_school(
    req: Request,
    school_data: SchoolCreateRequest
):
    """Create a single school"""
    
    new_school = School(
        school_name=school_data.school_name,
        county=school_data.county,
        country=school_data.country
    )
    
    created_school = await createSchool(req, new_school)
    
    if not created_school:
        raise HTTPException(
            status_code=500,
            detail="Failed to create school"
        )
    
    return created_school


@router.post("/bulk", response_model=List[School])
@error_decorator
async def create_schools_bulk(
    req: Request,
    bulk_request: BulkSchoolsCreateRequest
):
    """Create multiple schools from a JSON list"""
    
    # Convert request data to School models
    schools_to_create = [
        School(
            school_name=school_data.school_name,
            county=school_data.county,
            country=school_data.country
        )
        for school_data in bulk_request.schools
    ]
    
    created_schools = await createMultipleSchools(req, schools_to_create)
    
    if not created_schools:
        raise HTTPException(
            status_code=500,
            detail="Failed to create schools"
        )
    
    return created_schools


@router.get("/count", response_model=int)
@error_decorator
async def count_schools(
    req: Request,
    county: Optional[str] = None,
    country: Optional[str] = None
):
    """Count schools, optionally filtered by county or country"""
    
    filter_kwargs = {}
    if county:
        filter_kwargs['county'] = county
    if country:
        filter_kwargs['country'] = country
    
    count = await countSchools(req, **filter_kwargs)
    
    return count


@router.get("/{school_id}", response_model=School)
@error_decorator
async def get_school_by_id(
    req: Request,
    school_id: str
):
    """Get a school by ID"""
    
    school = await getSchoolById(req, school_id)
    
    if not school:
        raise HTTPException(
            status_code=404,
            detail="School not found"
        )
    
    return school
