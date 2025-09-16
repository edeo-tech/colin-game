from fastapi import Request, HTTPException, APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import Literal
import openai
import os
from decouple import config

from authentication import Authorization

router = APIRouter()
auth = Authorization()

# Load OpenAI API key
OPENAI_API_KEY = config('OPENAI_API_KEY', default='')

class AnswerCheckRequest(BaseModel):
    user_answer: str
    correct_answer: str
    question_text: str
    validation_type: Literal["exact", "case_insensitive", "contains"] = "exact"

class AnswerCheckResponse(BaseModel):
    is_correct: bool
    reason: str

@router.post('/check-answer')
async def check_answer(
    req: Request,
    answer_data: AnswerCheckRequest,
    user_id: str = Depends(auth.auth_wrapper)
):
    """Check if user's answer is correct using OpenAI for intelligent comparison"""
    
    try:
        # If no OpenAI key, fall back to direct comparison
        if not OPENAI_API_KEY:
            raise Exception("OpenAI API key not configured")
        
        # Set up OpenAI client
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        
        # Create the prompt for OpenAI
        prompt = f"""
You are an intelligent answer checker for a quiz application. Your job is to determine if a user's answer is correct compared to the expected answer.

Question: {answer_data.question_text}
Expected Answer: {answer_data.correct_answer}
User's Answer: {answer_data.user_answer}
Validation Type: {answer_data.validation_type}

Validation types:
- exact: User answer must match exactly
- case_insensitive: Case doesn't matter, but spelling and content must match
- contains: User answer should contain the key concept/term from the expected answer

Please evaluate if the user's answer is correct. Consider:
1. Spelling variations and common typos
2. Logical equivalence (e.g., "car" vs "automobile")
3. Abbreviations and contractions
4. Partial answers that capture the main concept (for 'contains' validation)

Respond with ONLY a JSON object in this exact format:
{{
    "is_correct": true/false,
    "reason": "Brief explanation of why the answer is correct or incorrect"
}}
"""

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful quiz answer checker. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.1  # Low temperature for consistent results
        )
        
        # Parse the response
        ai_response = response.choices[0].message.content.strip()
        
        # Try to parse as JSON
        import json
        try:
            result = json.loads(ai_response)
            
            # Validate the response structure
            if not isinstance(result, dict) or 'is_correct' not in result or 'reason' not in result:
                raise ValueError("Invalid response structure")
            
            return JSONResponse(
                status_code=200,
                content=jsonable_encoder(AnswerCheckResponse(
                    is_correct=bool(result['is_correct']),
                    reason=str(result['reason'])
                ))
            )
            
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Failed to parse OpenAI response: {ai_response}, Error: {e}")
            raise Exception("Invalid OpenAI response format")
            
    except Exception as e:
        print(f"OpenAI correction failed: {e}")
        
        # Fallback to direct comparison
        user_answer = answer_data.user_answer.strip()
        correct_answer = answer_data.correct_answer.strip()
        
        is_correct = False
        reason = ""
        
        if answer_data.validation_type == "exact":
            is_correct = user_answer == correct_answer
            reason = "Exact match required" if is_correct else f"Expected exactly: {correct_answer}"
            
        elif answer_data.validation_type == "case_insensitive":
            is_correct = user_answer.lower() == correct_answer.lower()
            reason = "Correct (case-insensitive match)" if is_correct else f"Expected: {correct_answer} (case doesn't matter)"
            
        elif answer_data.validation_type == "contains":
            is_correct = correct_answer.lower() in user_answer.lower() or user_answer.lower() in correct_answer.lower()
            reason = "Contains correct concept" if is_correct else f"Should contain: {correct_answer}"
        
        return JSONResponse(
            status_code=200,
            content=jsonable_encoder(AnswerCheckResponse(
                is_correct=is_correct,
                reason=reason
            ))
        )