'use client';

import { LeaderboardEntry } from '@/_interfaces/leaderboard/leaderboard';

interface LeaderboardEntryProps {
    entry: LeaderboardEntry;
    position: number;
    isCurrentUser?: boolean;
}

export default function LeaderboardEntryComponent({ 
    entry, 
    position, 
    isCurrentUser = false 
}: LeaderboardEntryProps) {
    const getPositionIcon = (pos: number) => {
        switch (pos) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${pos}`;
        }
    };

    const getPositionStyles = (pos: number) => {
        switch (pos) {
            case 1: return 'bg-yellow-600 border-yellow-500 text-white';
            case 2: return 'bg-gray-400 border-gray-300 text-white';
            case 3: return 'bg-orange-600 border-orange-500 text-white';
            default: return isCurrentUser 
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-700 border-gray-600 text-white';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`
            flex items-center justify-between p-4 rounded-xl border transition-all duration-200
            ${getPositionStyles(position)}
            ${isCurrentUser ? 'ring-2 ring-blue-400' : ''}
            hover:scale-[1.02] transform
        `}>
            {/* Position and Username */}
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                    {getPositionIcon(position)}
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-lg">
                        {entry.username}
                        {isCurrentUser && (
                            <span className="ml-2 text-sm bg-blue-500 px-2 py-1 rounded-full">
                                You
                            </span>
                        )}
                    </div>
                    <div className="text-sm opacity-75">
                        {formatDate(entry.created_at)}
                    </div>
                </div>
            </div>

            {/* Score */}
            <div className="text-right">
                <div className="text-2xl font-bold">
                    {entry.score}
                </div>
                <div className="text-sm opacity-75">
                    {entry.score === 1 ? 'point' : 'points'}
                </div>
            </div>
        </div>
    );
}