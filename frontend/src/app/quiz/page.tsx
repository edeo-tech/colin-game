'use client';

import { useAuth } from '@/context/auth/AuthContext';

export default function Quiz() {
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
                            <h1 className="text-xl font-semibold text-white">Quiz</h1>
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
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-600 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">This is the quiz page</h2>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}