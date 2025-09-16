import axiosConfig from '@/lib/axios';
import { QuestionParams, QuestionType } from '@/_interfaces/questions/questions';

export interface AnswerCheckRequest {
    user_answer: string;
    correct_answer: string;
    question_text: string;
    validation_type: "exact" | "case_insensitive" | "contains";
}

export interface AnswerCheckResponse {
    is_correct: boolean;
    reason: string;
}

const BASE_PATH = '/app/questions';

class QuestionsApi {
    getAllQuestions(params?: QuestionParams) {
        const searchParams = new URLSearchParams();
        if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
        
        const queryString = searchParams.toString();
        const url = queryString ? `${BASE_PATH}/all?${queryString}` : `${BASE_PATH}/all`;
        
        return axiosConfig.protectedApi.get(url);
    }

    getQuestionsByType(questionType: QuestionType, params?: QuestionParams) {
        const searchParams = new URLSearchParams();
        if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
        
        const queryString = searchParams.toString();
        const url = queryString 
            ? `${BASE_PATH}/by-type/${questionType}?${queryString}` 
            : `${BASE_PATH}/by-type/${questionType}`;
        
        return axiosConfig.protectedApi.get(url);
    }

    getQuestionById(questionId: string) {
        return axiosConfig.protectedApi.get(`${BASE_PATH}/by-id/${questionId}`);
    }

    checkAnswer(answerData: AnswerCheckRequest) {
        return axiosConfig.protectedApi.post(`${BASE_PATH}/check-answer`, answerData);
    }
}

const questionsApi = new QuestionsApi();
export default questionsApi;