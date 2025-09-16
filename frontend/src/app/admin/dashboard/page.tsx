'use client';

import { useAuth } from '@/context/auth/AuthContext';
import AdminGuard from '@/components/auth/AdminGuard';
import Link from 'next/link';

export default function AdminDashboard() {
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
                                    href="/home"
                                    className="text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    ←
                                </Link>
                                <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
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
                    {/* Welcome Section */}
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Admin Dashboard</h2>
                        <p className="text-gray-300 mb-6">
                            Welcome to the admin dashboard. Here you can manage various aspects of the application.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Stats Cards */}
                            <div className="bg-gray-700 border border-gray-600 rounded-xl p-6">
                                <div className="text-gray-400 text-sm mb-2">Total Users</div>
                                <div className="text-3xl font-bold text-white">-</div>
                            </div>
                            
                            <div className="bg-gray-700 border border-gray-600 rounded-xl p-6">
                                <div className="text-gray-400 text-sm mb-2">Total Questions</div>
                                <div className="text-3xl font-bold text-white">-</div>
                            </div>
                            
                            <div className="bg-gray-700 border border-gray-600 rounded-xl p-6">
                                <div className="text-gray-400 text-sm mb-2">Active Schools</div>
                                <div className="text-3xl font-bold text-white">-</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
                        <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link 
                                href="/admin/leaderboard"
                                className="bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-xl p-6 
                                         transition-all duration-200 group cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">
                                            View Admin Leaderboard
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">
                                            Access detailed leaderboard with admin controls
                                        </div>
                                    </div>
                                    <div className="text-gray-400 group-hover:text-blue-400 transition-colors">
                                        →
                                    </div>
                                </div>
                            </Link>
                            
                            <div className="bg-gray-700 border border-gray-600 rounded-xl p-6 opacity-50 cursor-not-allowed">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-lg font-medium text-white">
                                            Manage Questions
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">
                                            Coming soon...
                                        </div>
                                    </div>
                                    <div className="text-gray-400">
                                        →
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-700 border border-gray-600 rounded-xl p-6 opacity-50 cursor-not-allowed">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-lg font-medium text-white">
                                            Manage Users
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">
                                            Coming soon...
                                        </div>
                                    </div>
                                    <div className="text-gray-400">
                                        →
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-700 border border-gray-600 rounded-xl p-6 opacity-50 cursor-not-allowed">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-lg font-medium text-white">
                                            Manage Schools
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">
                                            Coming soon...
                                        </div>
                                    </div>
                                    <div className="text-gray-400">
                                        →
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
                        <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
                        <div className="text-gray-400 text-center py-8">
                            No recent activity to display
                        </div>
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}