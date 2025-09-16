import { useQuery, useMutation } from '@tanstack/react-query';
import questionsApi, { AnswerCheckRequest, AnswerCheckResponse } from '@/_api/questions/questions';
import { Question, QuestionParams, QuestionType } from '@/_interfaces/questions/questions';

export const useGetAllQuestions = (params?: QuestionParams) => {
    return useQuery<Question[], Error>({
        queryKey: ['questions', 'all', params],
        queryFn: async () => {
            const response = await questionsApi.getAllQuestions(params);
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};

export const useGetQuestionsByType = (questionType: QuestionType, params?: QuestionParams) => {
    return useQuery<Question[], Error>({
        queryKey: ['questions', 'by-type', questionType, params],
        queryFn: async () => {
            const response = await questionsApi.getQuestionsByType(questionType, params);
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        enabled: !!questionType, // Only run if questionType is provided
    });
};

export const useGetQuestionById = (questionId: string) => {
    return useQuery<Question, Error>({
        queryKey: ['questions', 'by-id', questionId],
        queryFn: async () => {
            const response = await questionsApi.getQuestionById(questionId);
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        enabled: !!questionId, // Only run if questionId is provided
    });
};

export const useCheckAnswer = () => {
    return useMutation<AnswerCheckResponse, Error, AnswerCheckRequest>({
        mutationFn: async (answerData: AnswerCheckRequest) => {
            const response = await questionsApi.checkAnswer(answerData);
            return response.data;
        },
        retry: 1,
    });
};