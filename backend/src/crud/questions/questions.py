from fastapi import Request, HTTPException
from typing import List, Optional
from datetime import datetime, timezone

from models.questions.questions import (
    Question, 
    QuestionCreate, 
    BaseQuestion,
    MultipleChoiceQuestion,
    TrueFalseQuestion,
    FillBlankQuestion,
    OrderQuestion,
    MatchQuestion
)
from crud._generic import _db_actions

async def create_question(req: Request, question_data: QuestionCreate) -> dict:
    """Create a single question based on its type"""
    
    # Convert QuestionCreate to the appropriate question model
    question = _convert_to_question_model(question_data)
    
    # Create the question document
    created_question = await _db_actions.createDocument(
        req=req,
        collection_name='questions',
        BaseModel=type(question),
        new_document=question
    )
    
    return created_question

async def create_questions_from_list(req: Request, questions_data: List[QuestionCreate]) -> List[dict]:
    """Create multiple questions from a list"""
    created_questions = []
    
    for question_data in questions_data:
        try:
            question = await create_question(req, question_data)
            created_questions.append(question)
        except Exception as e:
            # Log error but continue with other questions
            print(f"Error creating question: {e}")
            continue
    
    return created_questions

async def get_all_questions(req: Request, skip: int = 0, limit: int = 100) -> List[dict]:
    """Get all questions with pagination"""
    questions = await _db_actions.getAllDocuments(
        req=req,
        collection_name='questions',
        BaseModel=BaseQuestion,
        skip=skip,
        limit=limit
    )
    return questions

async def get_question_by_id(req: Request, question_id: str) -> dict:
    """Get a question by its ID"""
    question = await _db_actions.getDocument(
        req=req,
        collection_name='questions',
        BaseModel=BaseQuestion,
        id=question_id
    )
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    return question

async def get_questions_by_type(req: Request, question_type: str, skip: int = 0, limit: int = 100) -> List[dict]:
    """Get questions filtered by type"""
    questions = await _db_actions.getMultipleDocuments(
        req=req,
        collection_name='questions',
        BaseModel=BaseQuestion,
        type=question_type,
        skip=skip,
        limit=limit
    )
    return questions

async def update_question(req: Request, question_id: str, question_data: QuestionCreate) -> dict:
    """Update a question by ID"""
    # Convert to appropriate model
    question = _convert_to_question_model(question_data)
    
    # Update the question
    updated_question = await _db_actions.updateDocument(
        req=req,
        collection_name='questions',
        BaseModel=type(question),
        document_id=question_id,
        **question.model_dump(exclude={'id', 'created_at'})
    )
    
    if not updated_question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    return updated_question

async def delete_question(req: Request, question_id: str) -> bool:
    """Delete a question by ID"""
    deleted = await _db_actions.deleteDocument(
        req=req,
        collection_name='questions',
        BaseModel=BaseQuestion,
        document_id=question_id
    )
    
    if not deleted:
        raise HTTPException(status_code=404, detail="Question not found")
    
    return True

def _convert_to_question_model(question_data: QuestionCreate) -> Question:
    """Convert QuestionCreate to the appropriate question model"""
    data_dict = question_data.model_dump(exclude_none=True)
    
    if question_data.type == "multiple_choice":
        if not all(field in data_dict for field in ["question", "options", "correctOption", "explanation"]):
            raise HTTPException(status_code=400, detail="Missing required fields for multiple choice question")
        return MultipleChoiceQuestion(**data_dict)
    
    elif question_data.type == "true_false":
        if not all(field in data_dict for field in ["statement", "answer", "explanation"]):
            raise HTTPException(status_code=400, detail="Missing required fields for true/false question")
        return TrueFalseQuestion(**data_dict)
    
    elif question_data.type == "fill_blank":
        if not all(field in data_dict for field in ["question", "answer", "explanation"]):
            raise HTTPException(status_code=400, detail="Missing required fields for fill blank question")
        # Set default validation if not provided
        if "validation" not in data_dict:
            data_dict["validation"] = "exact"
        return FillBlankQuestion(**data_dict)
    
    elif question_data.type == "order":
        if not all(field in data_dict for field in ["question", "items", "correctOrder"]):
            raise HTTPException(status_code=400, detail="Missing required fields for order question")
        return OrderQuestion(**data_dict)
    
    elif question_data.type == "match":
        if not all(field in data_dict for field in ["question", "pairs"]):
            raise HTTPException(status_code=400, detail="Missing required fields for match question")
        return MatchQuestion(**data_dict)
    
    else:
        raise HTTPException(status_code=400, detail=f"Unknown question type: {question_data.type}")