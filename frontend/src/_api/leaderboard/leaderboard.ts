import axiosConfig from '@/lib/axios';
import { LeaderboardEntryCreate } from '@/_interfaces/leaderboard/leaderboard';

const BASE_PATH = '/app/leaderboard';

class LeaderboardApi {
    createLeaderboardEntry(entryData: LeaderboardEntryCreate) {
        return axiosConfig.protectedApi.post(`${BASE_PATH}/create`, entryData);
    }

    getAllTimeLeaderboard(limit: number = 10) {
        const searchParams = new URLSearchParams();
        searchParams.append('limit', limit.toString());
        
        return axiosConfig.protectedApi.get(`${BASE_PATH}/all-time?${searchParams.toString()}`);
    }

    getDailyLeaderboard(limit: number = 10) {
        const searchParams = new URLSearchParams();
        searchParams.append('limit', limit.toString());
        
        return axiosConfig.protectedApi.get(`${BASE_PATH}/daily?${searchParams.toString()}`);
    }

    getUserLeaderboardEntries(userId: string, limit: number = 10) {
        const searchParams = new URLSearchParams();
        searchParams.append('limit', limit.toString());
        
        return axiosConfig.protectedApi.get(`${BASE_PATH}/user/${userId}?${searchParams.toString()}`);
    }
}

const leaderboardApi = new LeaderboardApi();
export default leaderboardApi;