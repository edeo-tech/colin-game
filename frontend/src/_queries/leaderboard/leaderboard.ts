import { useQuery, useMutation } from '@tanstack/react-query';
import leaderboardApi from '@/_api/leaderboard/leaderboard';
import { 
    LeaderboardEntry, 
    LeaderboardEntryCreate,
    ScoreSubmission,
    ScoreSubmissionResponse,
    NationalLeaderboardEntry,
    SchoolLeaderboardEntry
} from '@/_interfaces/leaderboard/leaderboard';

// Score Submission (New primary way to submit scores)
export const useSubmitScore = () => {
    return useMutation<ScoreSubmissionResponse, Error, ScoreSubmission>({
        mutationFn: async (scoreData: ScoreSubmission) => {
            const response = await leaderboardApi.submitScore(scoreData);
            return response.data;
        },
        retry: 1,
    });
};

// National Leaderboard Hooks
export const useGetNationalAllTime = (limit?: number) => {
    return useQuery<NationalLeaderboardEntry[], Error>({
        queryKey: ['leaderboard', 'national', 'all-time', limit],
        queryFn: async () => {
            const response = await leaderboardApi.getNationalAllTime(limit);
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};

export const useGetNationalByDate = (date: string, limit?: number) => {
    return useQuery<NationalLeaderboardEntry[], Error>({
        queryKey: ['leaderboard', 'national', 'date', date, limit],
        queryFn: async () => {
            const response = await leaderboardApi.getNationalByDate(date, limit);
            return response.data;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
        retry: 1,
        enabled: !!date, // Only run if date is provided
    });
};

// School Leaderboard Hooks
export const useGetSchoolAllTime = (limit?: number) => {
    return useQuery<SchoolLeaderboardEntry[], Error>({
        queryKey: ['leaderboard', 'school', 'all-time', limit],
        queryFn: async () => {
            const response = await leaderboardApi.getSchoolAllTime(limit);
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};

export const useGetSchoolByDate = (date: string, limit?: number) => {
    return useQuery<SchoolLeaderboardEntry[], Error>({
        queryKey: ['leaderboard', 'school', 'date', date, limit],
        queryFn: async () => {
            const response = await leaderboardApi.getSchoolByDate(date, limit);
            return response.data;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
        retry: 1,
        enabled: !!date, // Only run if date is provided
    });
};

// Legacy hooks for backward compatibility
export const useCreateLeaderboardEntry = () => {
    return useMutation<LeaderboardEntry, Error, LeaderboardEntryCreate>({
        mutationFn: async (entryData: LeaderboardEntryCreate) => {
            const response = await leaderboardApi.createLeaderboardEntry(entryData);
            return response.data;
        },
        retry: 1,
    });
};

export const useGetAllTimeLeaderboard = (limit: number = 10) => {
    return useQuery<LeaderboardEntry[], Error>({
        queryKey: ['leaderboard', 'all-time', limit],
        queryFn: async () => {
            const response = await leaderboardApi.getAllTimeLeaderboard(limit);
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};

export const useGetDailyLeaderboard = (limit: number = 10) => {
    return useQuery<LeaderboardEntry[], Error>({
        queryKey: ['leaderboard', 'daily', limit],
        queryFn: async () => {
            const response = await leaderboardApi.getDailyLeaderboard(limit);
            return response.data;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes (more frequent updates for daily)
        retry: 1,
    });
};

export const useGetUserLeaderboardEntries = (userId: string, limit: number = 10) => {
    return useQuery<LeaderboardEntry[], Error>({
        queryKey: ['leaderboard', 'user', userId, limit],
        queryFn: async () => {
            const response = await leaderboardApi.getUserLeaderboardEntries(userId, limit);
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        enabled: !!userId, // Only run if userId is provided
    });
};