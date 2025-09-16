import { useQuery } from '@tanstack/react-query';
import leaderboardApi from '@/_api/leaderboard/leaderboard';
import { 
    NationalLeaderboardEntry,
    SchoolLeaderboardEntry
} from '@/_interfaces/leaderboard/leaderboard';

// Admin National Leaderboard with polling
export const useAdminNationalLeaderboard = (date: string | null, limit?: number) => {
    const isAllTime = !date;
    
    return useQuery<NationalLeaderboardEntry[], Error>({
        queryKey: isAllTime 
            ? ['leaderboard', 'admin', 'national', 'all-time', limit]
            : ['leaderboard', 'admin', 'national', 'date', date, limit],
        queryFn: async () => {
            const response = isAllTime 
                ? await leaderboardApi.getNationalAllTime(limit)
                : await leaderboardApi.getNationalByDate(date!, limit);
            return response.data;
        },
        refetchInterval: 10000, // Poll every 10 seconds
        staleTime: 0, // Always consider data stale to ensure polling works
        retry: 1,
    });
};

// Admin School Leaderboard with polling
export const useAdminSchoolLeaderboard = (date: string | null, limit?: number) => {
    const isAllTime = !date;
    
    return useQuery<SchoolLeaderboardEntry[], Error>({
        queryKey: isAllTime 
            ? ['leaderboard', 'admin', 'school', 'all-time', limit]
            : ['leaderboard', 'admin', 'school', 'date', date, limit],
        queryFn: async () => {
            const response = isAllTime 
                ? await leaderboardApi.getSchoolAllTime(limit)
                : await leaderboardApi.getSchoolByDate(date!, limit);
            return response.data;
        },
        refetchInterval: 10000, // Poll every 10 seconds
        staleTime: 0, // Always consider data stale to ensure polling works
        retry: 1,
    });
};