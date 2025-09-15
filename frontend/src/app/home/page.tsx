'use client';

import { useAuth } from '@/context/auth/AuthContext';
import Link from 'next/link';

export default function Home() {
    const { auth, logout, logoutLoading } = useAuth();

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
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-white">Home</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-300">Welcome, {auth.username}!</span>
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

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0 space-y-6">
                    {/* Welcome Section */}
                    {/* <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl shadow-black/20">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">This is home</h2>
                            <div className="text-gray-300 space-y-2">
                                <p>User ID: {auth.id}</p>
                                <p>Username: {auth.username}</p>
                                <p>Email: {auth.email}</p>
                                <p>XP Earned: {auth.xp_earned}</p>
                            </div>
                        </div>
                    </div> */}

                    {/* Navigation Cards */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        {/* Quiz Card */}
                        <Link 
                            href="/quiz"
                            className="group bg-gray-800 border border-gray-700 rounded-2xl p-8 
                                     hover:bg-gray-700 hover:border-gray-600 
                                     transition-all duration-200 cursor-pointer
                                     shadow-xl shadow-black/20 hover:shadow-2xl 
                                     transform hover:scale-105 active:scale-95"
                        >
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center 
                                              group-hover:bg-blue-500 transition-colors duration-200">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200">
                                    Quiz
                                </h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                                    Test your knowledge with interactive questions
                                </p>
                            </div>
                        </Link>

                        {/* Leaderboards Card */}
                        <Link 
                            href="/leaderboards"
                            className="group bg-gray-800 border border-gray-700 rounded-2xl p-8 
                                     hover:bg-gray-700 hover:border-gray-600 
                                     transition-all duration-200 cursor-pointer
                                     shadow-xl shadow-black/20 hover:shadow-2xl 
                                     transform hover:scale-105 active:scale-95"
                        >
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-yellow-600 rounded-2xl mx-auto flex items-center justify-center 
                                              group-hover:bg-yellow-500 transition-colors duration-200">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-200">
                                    Leaderboards
                                </h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                                    See how you rank against other players
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}