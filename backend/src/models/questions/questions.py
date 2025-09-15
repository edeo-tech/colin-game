from pydantic import Field, BaseModel
from typing import List, Dict, Union, Literal, Optional
from models._base import MongoBaseModel

class BaseQuestion(MongoBaseModel):
    """Base question model that all question types inherit from"""
    type: str = Field(..., description="Question type")

class MultipleChoiceQuestion(BaseQuestion):
    type: Literal["multiple_choice"] = Field(default="multiple_choice", description="Question type")
    question: str = Field(..., description="The question text")
    options: List[str] = Field(..., description="List of answer options")
    correctOption: int = Field(..., description="Index of the correct option")
    explanation: str = Field(..., description="Explanation for the correct answer")

class TrueFalseQuestion(BaseQuestion):
    type: Literal["true_false"] = Field(default="true_false", description="Question type")
    statement: str = Field(..., description="The statement to evaluate")
    answer: bool = Field(..., description="Whether the statement is true or false")
    explanation: str = Field(..., description="Explanation for the answer")

class FillBlankQuestion(BaseQuestion):
    type: Literal["fill_blank"] = Field(default="fill_blank", description="Question type")
    question: str = Field(..., description="The question text with blank")
    answer: str = Field(..., description="The correct answer to fill the blank")
    validation: Literal["exact", "case_insensitive", "contains"] = Field(
        default="exact", 
        description="Type of validation for the answer"
    )
    explanation: str = Field(..., description="Explanation for the correct answer")

class OrderQuestion(BaseQuestion):
    type: Literal["order"] = Field(default="order", description="Question type")
    question: str = Field(..., description="The question text")
    items: List[str] = Field(..., description="List of items to be ordered")
    correctOrder: List[int] = Field(..., description="Correct order as list of indices")
    explanation: Optional[str] = Field(default="", description="Explanation for the correct order")

class MatchQuestion(BaseQuestion):
    type: Literal["match"] = Field(default="match", description="Question type")
    question: str = Field(..., description="The question text")
    pairs: Dict[str, str] = Field(..., description="Dictionary of items to match")
    explanation: Optional[str] = Field(default="", description="Explanation for the matches")

# Union type for all question types
Question = Union[
    MultipleChoiceQuestion,
    TrueFalseQuestion,
    FillBlankQuestion,
    OrderQuestion,
    MatchQuestion
]

class QuestionCreate(BaseModel):
    type: Literal["multiple_choice", "true_false", "fill_blank", "order", "match"]
    question: Optional[str] = None
    statement: Optional[str] = None  # For true_false
    options: Optional[List[str]] = None  # For multiple_choice
    correctOption: Optional[int] = None  # For multiple_choice
    answer: Optional[Union[str, bool]] = None  # For fill_blank and true_false
    validation: Optional[str] = None  # For fill_blank
    items: Optional[List[str]] = None  # For order
    correctOrder: Optional[List[int]] = None  # For order
    pairs: Optional[Dict[str, str]] = None  # For match
    explanation: Optional[str] = None

class QuestionListCreate(BaseModel):
    questions: List[QuestionCreate] = Field(..., description="List of questions to create")