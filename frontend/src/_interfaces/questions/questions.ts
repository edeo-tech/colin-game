export interface BaseQuestion {
    id: string;
    type: string;
    created_at?: string;
    updated_at?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: "multiple_choice";
    question: string;
    options: string[];
    correctOption: number;
    explanation: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
    type: "true_false";
    statement: string;
    answer: boolean;
    explanation: string;
}

export interface FillBlankQuestion extends BaseQuestion {
    type: "fill_blank";
    question: string;
    answer: string;
    validation: "exact" | "case_insensitive" | "contains";
    explanation: string;
}

export interface OrderQuestion extends BaseQuestion {
    type: "order";
    question: string;
    items: string[];
    correctOrder: number[];
    explanation?: string;
}

export interface MatchQuestion extends BaseQuestion {
    type: "match";
    question: string;
    pairs: Record<string, string>;
    explanation?: string;
}

export type Question = 
    | MultipleChoiceQuestion 
    | TrueFalseQuestion 
    | FillBlankQuestion 
    | OrderQuestion 
    | MatchQuestion;

export interface QuestionsResponse {
    questions?: Question[];
    message?: string;
}

export interface QuestionParams {
    skip?: number;
    limit?: number;
}

export type QuestionType = "multiple_choice" | "true_false" | "fill_blank" | "order" | "match";