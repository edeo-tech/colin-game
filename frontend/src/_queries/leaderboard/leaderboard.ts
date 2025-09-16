import { useQuery, useMutation } from '@tanstack/react-query';
import leaderboardApi from '@/_api/leaderboard/leaderboard';
import { LeaderboardEntry, LeaderboardEntryCreate } from '@/_interfaces/leaderboard/leaderboard';

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