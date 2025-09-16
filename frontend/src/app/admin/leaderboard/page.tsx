'use client';

import { useAuth } from '@/context/auth/AuthContext';
import AdminGuard from '@/components/auth/AdminGuard';
import Link from 'next/link';

export default function AdminLeaderboard() {
    const { auth, logout, logoutLoading } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gray-900">
                {/* Navigation */}
                <nav className="bg-gray-800 border-b border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center space-x-4">
                                <Link 
                                    href="/admin/dashboard"
                                    className="text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    ←
                                </Link>
                                <h1 className="text-xl font-semibold text-white">Admin Leaderboard</h1>
                                <span className="text-yellow-500 text-sm bg-yellow-900/20 px-2 py-1 rounded">ADMIN</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-300 hidden sm:block">
                                    Welcome, {auth?.username}! 
                                    <span className="text-gray-400 text-sm ml-2">({auth?.role})</span>
                                </span>
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

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                    {/* Header Section */}
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Admin Leaderboard Management</h2>
                        <p className="text-gray-300 mb-6">
                            Advanced leaderboard view with administrative controls and detailed analytics.
                        </p>
                        
                        {/* Admin Controls */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                Export Data
                            </button>
                            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                Filter by School
                            </button>
                            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                Date Range
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                Clear Scores
                            </button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                            <div className="text-gray-400 text-sm mb-2">Total Players</div>
                            <div className="text-2xl font-bold text-white">-</div>
                        </div>
                        
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                            <div className="text-gray-400 text-sm mb-2">Average Score</div>
                            <div className="text-2xl font-bold text-white">-</div>
                        </div>
                        
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                            <div className="text-gray-400 text-sm mb-2">Highest Score</div>
                            <div className="text-2xl font-bold text-white">-</div>
                        </div>
                        
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                            <div className="text-gray-400 text-sm mb-2">Total Games</div>
                            <div className="text-2xl font-bold text-white">-</div>
                        </div>
                    </div>

                    {/* Leaderboard Table */}
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-700">
                            <h3 className="text-xl font-semibold text-white">Detailed Leaderboard</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Rank
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Player
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            School
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Score
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Games Played
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Last Played
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                                            No leaderboard data available yet. Start playing to see scores!
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination (placeholder) */}
                        <div className="p-4 border-t border-gray-700 flex justify-between items-center">
                            <div className="text-sm text-gray-400">
                                Showing 0 to 0 of 0 results
                            </div>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 bg-gray-700 text-gray-400 rounded cursor-not-allowed" disabled>
                                    Previous
                                </button>
                                <button className="px-3 py-1 bg-gray-700 text-gray-400 rounded cursor-not-allowed" disabled>
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Admin Features */}
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
                        <h3 className="text-xl font-semibold text-white mb-6">Admin Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-white">Score Management</h4>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <p>• Remove suspicious scores</p>
                                    <p>• Adjust player scores</p>
                                    <p>• Reset school leaderboards</p>
                                    <p>• Export historical data</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-white">Analytics</h4>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <p>• View player statistics</p>
                                    <p>• Track engagement metrics</p>
                                    <p>• Monitor quiz performance</p>
                                    <p>• Generate reports</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}