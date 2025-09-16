import axiosConfig from '@/lib/axios';
import { 
    LeaderboardEntryCreate, 
    ScoreSubmission, 
    ScoreSubmissionResponse,
    NationalLeaderboardEntry,
    SchoolLeaderboardEntry
} from '@/_interfaces/leaderboard/leaderboard';

const BASE_PATH = '/app/leaderboard';

class LeaderboardApi {
    // Score submission (replaces createLeaderboardEntry)
    submitScore(scoreData: ScoreSubmission): Promise<{ data: ScoreSubmissionResponse }> {
        return axiosConfig.protectedApi.post(`${BASE_PATH}/submit-score`, scoreData);
    }

    // National Leaderboard APIs
    getNationalAllTime(limit?: number): Promise<{ data: NationalLeaderboardEntry[] }> {
        const searchParams = new URLSearchParams();
        if (limit) {
            searchParams.append('limit', limit.toString());
        }
        
        const queryString = searchParams.toString();
        return axiosConfig.protectedApi.get(`${BASE_PATH}/national/all-time${queryString ? '?' + queryString : ''}`);
    }

    getNationalByDate(date: string, limit?: number): Promise<{ data: NationalLeaderboardEntry[] }> {
        const searchParams = new URLSearchParams();
        if (limit) {
            searchParams.append('limit', limit.toString());
        }
        
        const queryString = searchParams.toString();
        return axiosConfig.protectedApi.get(`${BASE_PATH}/national/date/${date}${queryString ? '?' + queryString : ''}`);
    }

    // School Leaderboard APIs
    getSchoolAllTime(limit?: number): Promise<{ data: SchoolLeaderboardEntry[] }> {
        const searchParams = new URLSearchParams();
        if (limit) {
            searchParams.append('limit', limit.toString());
        }
        
        const queryString = searchParams.toString();
        return axiosConfig.protectedApi.get(`${BASE_PATH}/school/all-time${queryString ? '?' + queryString : ''}`);
    }

    getSchoolByDate(date: string, limit?: number): Promise<{ data: SchoolLeaderboardEntry[] }> {
        const searchParams = new URLSearchParams();
        if (limit) {
            searchParams.append('limit', limit.toString());
        }
        
        const queryString = searchParams.toString();
        return axiosConfig.protectedApi.get(`${BASE_PATH}/school/date/${date}${queryString ? '?' + queryString : ''}`);
    }

    // Legacy APIs for backward compatibility
    createLeaderboardEntry(entryData: LeaderboardEntryCreate) {
        return axiosConfig.protectedApi.post(`${BASE_PATH}/create`, entryData);
    }

    getAllTimeLeaderboard(limit: number = 10) {
        return this.getNationalAllTime(limit);
    }

    getDailyLeaderboard(limit: number = 10) {
        const today = new Date().toISOString().split('T')[0];
        return this.getNationalByDate(today, limit);
    }

    getUserLeaderboardEntries(userId: string, limit: number = 10) {
        const searchParams = new URLSearchParams();
        searchParams.append('limit', limit.toString());
        
        return axiosConfig.protectedApi.get(`${BASE_PATH}/user/${userId}?${searchParams.toString()}`);
    }
}

const leaderboardApi = new LeaderboardApi();
export default leaderboardApi;