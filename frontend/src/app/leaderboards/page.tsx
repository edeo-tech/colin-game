'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth/AuthContext';
import { 
    useGetNationalAllTime, 
    useGetNationalByDate, 
    useGetSchoolAllTime, 
    useGetSchoolByDate 
} from '@/_queries/leaderboard/leaderboard';
import { UserRole } from '@/_interfaces/users/user-role';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import Link from 'next/link';

export default function Leaderboards() {
    const { auth, logout, logoutLoading } = useAuth();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [useDateFilter, setUseDateFilter] = useState(false);

    // Today's date for default
    const today = new Date().toISOString().split('T')[0];

    // Fetch national leaderboards
    const { data: nationalAllTime, isLoading: nationalAllTimeLoading, error: nationalAllTimeError } = 
        useGetNationalAllTime();
    const { data: nationalByDate, isLoading: nationalByDateLoading, error: nationalByDateError } = 
        useGetNationalByDate(useDateFilter ? (selectedDate || today) : '', undefined);

    // Fetch school leaderboards
    const { data: schoolAllTime, isLoading: schoolAllTimeLoading, error: schoolAllTimeError } = 
        useGetSchoolAllTime();
    const { data: schoolByDate, isLoading: schoolByDateLoading, error: schoolByDateError } = 
        useGetSchoolByDate(useDateFilter ? (selectedDate || today) : '', undefined);
    
    useEffect(() => {
        console.log("National All Time:", nationalAllTime);
        console.log("National By Date:", nationalByDate);
        console.log("School All Time:", schoolAllTime);
        console.log("School By Date:", schoolByDate);
    }, [nationalAllTime, nationalByDate, schoolAllTime, schoolByDate]);

    const handleLogout = () => {
        logout();
    };

    const handleDateToggle = () => {
        setUseDateFilter(!useDateFilter);
        if (!useDateFilter && !selectedDate) {
            setSelectedDate(today);
        }
    };

    if (!auth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    // Determine which data to use based on filter
    const nationalData = useDateFilter ? nationalByDate : nationalAllTime;
    const nationalLoading = useDateFilter ? nationalByDateLoading : nationalAllTimeLoading;
    const nationalError = useDateFilter ? nationalByDateError : nationalAllTimeError;

    const schoolData = useDateFilter ? schoolByDate : schoolAllTime;
    const schoolLoading = useDateFilter ? schoolByDateLoading : schoolAllTimeLoading;
    const schoolError = useDateFilter ? schoolByDateError : schoolAllTimeError;

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
                            <span className="text-gray-300 hidden sm:block">
                                Welcome, {auth.username}! 
                                <span className="text-gray-400 text-sm ml-2">({auth.role})</span>
                            </span>
                            {auth.role === UserRole.ADMIN && (
                                <button
                                    onClick={handleLogout}
                                    disabled={logoutLoading}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {logoutLoading ? 'Logging out...' : 'Logout'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
                {/* Filters */}
                <div className="mb-6 bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="flex items-center space-x-3">
                            <label className="text-white font-medium">View:</label>
                            <button
                                onClick={handleDateToggle}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    !useDateFilter
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                All Time
                            </button>
                            <button
                                onClick={handleDateToggle}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    useDateFilter
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                By Date
                            </button>
                        </div>
                        
                        {useDateFilter && (
                            <div className="flex items-center space-x-3">
                                <label htmlFor="date-picker" className="text-gray-300 text-sm">
                                    Date:
                                </label>
                                <input
                                    id="date-picker"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    max={today}
                                    className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Leaderboards Container */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {/* National Leaderboard */}
                    <LeaderboardTable
                        title={`National ${useDateFilter ? 'Daily' : 'All-Time'}`}
                        entries={nationalData?.map((entry, index) => ({
                            ...entry,
                            id: entry._id || `national-${index}` // Map _id to id for compatibility
                        })) || []}
                        isLoading={nationalLoading}
                        error={nationalError}
                        currentUserId={auth?.id}
                        emptyMessage={useDateFilter 
                            ? `No scores for ${selectedDate || today} yet. Be the first to play on this date!`
                            : "No all-time scores yet. Be the first to set a record!"
                        }
                        icon="🇮🇪"
                    />

                    {/* School Leaderboard */}
                    <LeaderboardTable
                        title={`School ${useDateFilter ? 'Daily' : 'All-Time'}`}
                        entries={schoolData?.map((entry, index) => ({
                            id: entry._id || `school-${index}`,
                            _id: entry._id,
                            username: `${entry.school_name}${entry.county ? ` (${entry.county})` : ''}`,
                            user_id: entry.school_id,
                            score: entry.total_score,
                            created_at: entry.created_at,
                            updated_at: entry.updated_at
                        })) || []}
                        isLoading={schoolLoading}
                        error={schoolError}
                        currentUserId={auth?.school_id}
                        emptyMessage={useDateFilter 
                            ? `No school scores for ${selectedDate || today} yet. Schools need students to play!`
                            : "No school scores yet. Students need to play to represent their schools!"
                        }
                        icon="🏫"
                    />
                </div>
            </main>
        </div>
    );
}