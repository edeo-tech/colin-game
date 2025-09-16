// National Leaderboard Entry
export interface NationalLeaderboardEntry {
    _id: string;
    username: string;
    user_id: string;
    score: number;
    created_at: string;
    updated_at: string;
}

// School Leaderboard Entry
export interface SchoolLeaderboardEntry {
    _id: string;
    school_id: string;
    school_name: string;
    total_score: number;
    user_count: number;
    created_at: string;
    updated_at: string;
}

// Score Submission for Quiz Completion
export interface ScoreSubmission {
    user_id: string;
    username: string;
    score: number;
    school_id?: string;
}

// Response from score submission
export interface ScoreSubmissionResponse {
    national_entry: NationalLeaderboardEntry | null;
    school_entry: SchoolLeaderboardEntry | null;
    success: boolean;
    errors: string[];
}

// Legacy interfaces for backward compatibility
export interface LeaderboardEntry extends NationalLeaderboardEntry {
    id: string; // Map _id to id for compatibility
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