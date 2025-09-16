'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { useGetAllTimeLeaderboard, useGetDailyLeaderboard } from '@/_queries/leaderboard/leaderboard';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import Link from 'next/link';

export default function Leaderboards() {
    const { auth, logout, logoutLoading } = useAuth();

    // Fetch leaderboards
    const { data: allTimeLeaderboard, isLoading: allTimeLoading, error: allTimeError } = useGetAllTimeLeaderboard(10);
    const { data: dailyLeaderboard, isLoading: dailyLoading, error: dailyError } = useGetDailyLeaderboard(10);

    const handleLogout = () => {
        logout();
    };

    if (!auth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navigation */}
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link 
                                href="/home"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                ←
                            </Link>
                            <h1 className="text-xl font-semibold text-white">Leaderboards</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-300 hidden sm:block">Welcome, {auth.username}!</span>
                            <button
                                onClick={handleLogout}
                                disabled={logoutLoading}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {logoutLoading ? 'Logging out...' : 'Logout'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
                {/* All-Time Leaderboard */}
                <LeaderboardTable
                    title="National All-Time"
                    entries={allTimeLeaderboard || []}
                    isLoading={allTimeLoading}
                    error={allTimeError}
                    currentUserId={auth?.id}
                    emptyMessage="No all-time scores yet. Be the first to set a record!"
                    icon="🏆"
                />

                {/* Daily Leaderboard */}
                <LeaderboardTable
                    title="National Daily"
                    entries={dailyLeaderboard || []}
                    isLoading={dailyLoading}
                    error={dailyError}
                    currentUserId={auth?.id}
                    emptyMessage="No scores today yet. Be the first to play today!"
                    icon="📅"
                />
            </main>
        </div>
    );
}