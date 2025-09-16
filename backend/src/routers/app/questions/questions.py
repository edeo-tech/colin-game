from fastapi import Request, HTTPException, APIRouter, Query, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List, Optional

from models.questions.questions import QuestionCreate, QuestionListCreate
from crud.questions.questions import (
    create_question,
    create_questions_from_list,
    get_all_questions,
    get_question_by_id,
    get_questions_by_type,
    update_question,
    delete_question
)
from utils.__errors__.error_decorator_routes import error_decorator
from authentication import Authorization

router = APIRouter()
auth = Authorization()

@router.post('/create')
@error_decorator
async def create_single_question(
    req: Request, 
    question: QuestionCreate,
    user_id: str = Depends(auth.auth_wrapper)
):
    """Create a single question"""
    created_question = await create_question(req, question)
    return JSONResponse(
        status_code=201,
        content=jsonable_encoder(created_question)
    )

@router.post('/create-from-list')
@error_decorator
async def create_questions_from_list_route(
    req: Request, 
    question_list: dict,
    user_id: str = Depends(auth.auth_wrapper)
):
    """Create multiple questions from a list"""
    print(question_list)
    question_list = QuestionListCreate(**question_list)
    created_questions = await create_questions_from_list(req, question_list.questions)
    return JSONResponse(
        status_code=201,
        content=jsonable_encoder({
            "created_count": len(created_questions),
            "questions": created_questions
        })
    )

@router.get('/all')
@error_decorator
async def get_all_questions_route(
    req: Request,
    skip: int = Query(0, ge=0, description="Number of questions to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of questions to return"),
    user_id: str = Depends(auth.auth_wrapper)
):
    """Get all questions with pagination"""
    questions = await get_all_questions(req, skip=skip, limit=limit)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder(questions)
    )

@router.get('/by-id/{question_id}')
@error_decorator
async def get_question_by_id_route(
    req: Request, 
    question_id: str,
    user_id: str = Depends(auth.auth_wrapper)
):
    """Get a question by its ID"""
    question = await get_question_by_id(req, question_id)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder(question)
    )

@router.get('/by-type/{question_type}')
@error_decorator
async def get_questions_by_type_route(
    req: Request,
    question_type: str,
    skip: int = Query(0, ge=0, description="Number of questions to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of questions to return"),
    user_id: str = Depends(auth.auth_wrapper)
):
    """Get questions filtered by type"""
    valid_types = ["multiple_choice", "true_false", "fill_blank", "order", "match"]
    if question_type not in valid_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid question type. Must be one of: {', '.join(valid_types)}"
        )
    
    questions = await get_questions_by_type(req, question_type, skip=skip, limit=limit)
    print(f"DEBUG: Found {len(questions)} questions of type {question_type}")
    for i, q in enumerate(questions[:2]):  # Log first 2 questions
        print(f"DEBUG: Question {i}: {q}")
    
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder(questions)
    )

@router.put('/update/{question_id}')
@error_decorator
async def update_question_route(
    req: Request, 
    question_id: str, 
    question: QuestionCreate,
    user_id: str = Depends(auth.auth_wrapper)
):
    """Update a question by ID"""
    updated_question = await update_question(req, question_id, question)
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder(updated_question)
    )

@router.delete('/delete/{question_id}')
@error_decorator
async def delete_question_route(
    req: Request, 
    question_id: str,
    user_id: str = Depends(auth.auth_wrapper)
):
    """Delete a question by ID"""
    await delete_question(req, question_id)
    return JSONResponse(
        status_code=200,
        content={"message": "Question deleted successfully"}
    )

