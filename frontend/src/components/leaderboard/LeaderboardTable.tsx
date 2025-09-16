'use client';

import { LeaderboardEntry } from '@/_interfaces/leaderboard/leaderboard';
import LeaderboardEntryComponent from './LeaderboardEntry';

interface LeaderboardTableProps {
    title: string;
    entries: LeaderboardEntry[];
    isLoading: boolean;
    error: Error | null;
    currentUserId?: string;
    emptyMessage?: string;
    icon?: string;
}

export default function LeaderboardTable({ 
    title,
    entries,
    isLoading,
    error,
    currentUserId,
    emptyMessage = "No scores yet. Be the first to play!",
    icon = "🏆"
}: LeaderboardTableProps) {
    if (isLoading) {
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <span className="text-2xl">{icon}</span>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                </div>
                
                <div className="space-y-3">
                    {[...Array(5)].map((_, index) => (
                        <div key={`loading-skeleton-${index}`} className="animate-pulse">
                            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-xl">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-600 rounded w-24"></div>
                                        <div className="h-3 bg-gray-600 rounded w-16"></div>
                                    </div>
                                </div>
                                <div className="h-6 bg-gray-600 rounded w-12"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <span className="text-2xl">{icon}</span>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                </div>
                
                <div className="text-center py-8">
                    <div className="text-red-300 text-lg font-medium mb-2">
                        Failed to load leaderboard
                    </div>
                    <div className="text-gray-400 text-sm">
                        {error.message}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">{icon}</span>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>

            {/* Leaderboard Entries */}
            {entries && entries.length > 0 ? (
                <div className="space-y-3">
                    {entries.map((entry, index) => (
                        <LeaderboardEntryComponent
                            key={entry.id}
                            entry={entry}
                            position={index + 1}
                            isCurrentUser={entry.user_id === currentUserId}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <div className="text-gray-300 text-lg font-medium mb-2">
                        {emptyMessage}
                    </div>
                    <div className="text-gray-400 text-sm">
                        Complete a quiz to see your score here
                    </div>
                </div>
            )}
        </div>
    );
}