export interface LeaderboardEntry {
    id: string;
    username: string;
    user_id: string;
    score: number;
    created_at: string;
    updated_at: string;
}

export interface LeaderboardEntryCreate {
    username: string;
    user_id: string;
    score: number;
}

export interface LeaderboardResponse {
    leaderboard?: LeaderboardEntry[];
    message?: string;
}

export interface CreateLeaderboardEntryResponse {
    entry?: LeaderboardEntry;
    message?: string;
}