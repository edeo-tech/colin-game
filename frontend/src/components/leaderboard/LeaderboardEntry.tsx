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
    const truncateText = (text: string, maxLength: number = 15) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
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
            flex items-center justify-between p-2 sm:p-4 rounded-xl border transition-all duration-200
            ${getPositionStyles(position)}
            ${isCurrentUser ? 'ring-2 ring-blue-400' : ''}
            hover:scale-[1.02] transform
        `}>
            {/* Position and Username */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg">
                    #{position}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm sm:text-lg truncate">
                        <span className="sm:hidden">{truncateText(entry.username, 15)}</span>
                        <span className="hidden sm:inline">{entry.username}</span>
                        {isCurrentUser && (
                            <span className="ml-1 sm:ml-2 text-xs sm:text-sm bg-blue-500 px-1 sm:px-2 py-1 rounded-full">
                                You
                            </span>
                        )}
                    </div>
                    <div className="text-xs sm:text-sm opacity-75 truncate">
                        {formatDate(entry.created_at)}
                    </div>
                </div>
            </div>

            {/* Score */}
            <div className="text-right flex-shrink-0 ml-2">
                <div className="text-lg sm:text-2xl font-bold">
                    {entry.score}
                </div>
                <div className="text-xs sm:text-sm opacity-75">
                    {entry.score === 1 ? 'pt' : 'pts'}
                </div>
            </div>
        </div>
    );
}