from fastapi import Request
from typing import Optional, List
from models.schools.school import School
from crud._generic._db_actions import (
    createDocument,
    createMultipleDocuments,
    getAllDocuments,
    getDocument,
    getMultipleDocuments,
    updateDocument,
    deleteDocument,
    countDocuments,
    countAllDocuments,
    SortDirection
)


async def createSchool(
    req: Request,
    new_school: School
) -> School:
    return await createDocument(
        req,
        'schools',
        School,
        new_school
    )


async def createMultipleSchools(
    req: Request,
    new_schools: List[School]
) -> List[School]:
    return await createMultipleDocuments(
        req,
        'schools',
        School,
        new_schools
    )


async def getAllSchools(
    req: Request,
    order_by: Optional[str] = 'school_name',
    order_direction: Optional[SortDirection] = SortDirection.ASCENDING,
    limit: Optional[int] = 0
) -> List[School]:
    return await getAllDocuments(
        req,
        'schools',
        School,
        order_by=order_by,
        order_direction=order_direction,
        limit=limit
    )


async def getSchoolById(
    req: Request,
    school_id: str
) -> School | None:
    return await getDocument(
        req,
        'schools',
        School,
        _id=school_id
    )


async def getSchoolByName(
    req: Request,
    school_name: str
) -> School | None:
    return await getDocument(
        req,
        'schools',
        School,
        school_name=school_name
    )


async def getSchoolsByCounty(
    req: Request,
    county: str,
    order_by: Optional[str] = 'school_name',
    order_direction: Optional[SortDirection] = SortDirection.ASCENDING,
    limit: Optional[int] = 0
) -> List[School]:
    return await getMultipleDocuments(
        req,
        'schools',
        School,
        county=county,
        order_by=order_by,
        order_direction=order_direction,
        limit=limit
    )


async def getSchoolsByCountry(
    req: Request,
    country: str,
    order_by: Optional[str] = 'school_name',
    order_direction: Optional[SortDirection] = SortDirection.ASCENDING,
    limit: Optional[int] = 0
) -> List[School]:
    return await getMultipleDocuments(
        req,
        'schools',
        School,
        country=country,
        order_by=order_by,
        order_direction=order_direction,
        limit=limit
    )


async def updateSchool(
    req: Request,
    school_id: str,
    **update_fields
) -> School | None:
    return await updateDocument(
        req,
        'schools',
        School,
        school_id,
        **update_fields
    )


async def deleteSchool(
    req: Request,
    school_id: str
) -> School | None:
    return await deleteDocument(
        req,
        'schools',
        School,
        _id=school_id
    )


async def countSchools(
    req: Request,
    **filter_kwargs
) -> int:
    if filter_kwargs:
        return await countDocuments(
            req,
            'schools',
            School,
            **filter_kwargs
        )
    else:
        return await countAllDocuments(
            req,
            'schools',
            School
        )