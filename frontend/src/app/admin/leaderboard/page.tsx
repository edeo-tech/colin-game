'use client';

import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/auth/AuthContext';
import AdminGuard from '@/components/auth/AdminGuard';
// import Link from 'next/link';
import LeaderboardSection from '@/components/leaderboard/LeaderboardSection';
import { useAdminNationalLeaderboard, useAdminSchoolLeaderboard } from '@/_queries/leaderboard/admin-leaderboard';
import Image from 'next/image';

export default function AdminLeaderboard() {
    // const { auth, logout, logoutLoading } = useAuth();
    
    // Date states for each leaderboard
    const [nationalDate, setNationalDate] = useState<string | null>(null);
    const [schoolDate, setSchoolDate] = useState<string | null>(null);
    
    // Leaderboard data
    const { 
        data: nationalData, 
        isLoading: nationalLoading 
    } = useAdminNationalLeaderboard(nationalDate); // No limit

    useEffect(() => {
        console.log("National Data:", nationalData);
    }, [nationalData]);
    
    const { 
        data: schoolData, 
        isLoading: schoolLoading 
    } = useAdminSchoolLeaderboard(schoolDate); // No limit

    useEffect(() => {
        console.log("School Data:", schoolData);
    }, [schoolData]);

    // const handleLogout = () => {
    //     logout();
    // };

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gray-900">
                {/* Navigation */}
                {/* <nav className="bg-gray-800 border-b border-gray-700">
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
                </nav> */}

                {/* Floating QR Code */}
                <div className="fixed bottom-4 left-4 z-50">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
                        <div className="relative" style={{ width: '10vw', height: '10vw' }}>
                            <Image
                                src="/qr_code.png"
                                alt="Site QR Code"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="max-w-[1400px] mx-auto px-4 py-8 pb-[400px]">
                    {/* Leaderboards Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* National Leaderboard */}
                        <LeaderboardSection
                            title="🏆 National Leaderboard"
                            data={nationalData || []}
                            type="national"
                            isLoading={nationalLoading}
                            selectedDate={nationalDate}
                            onDateChange={setNationalDate}
                        />

                        {/* School Leaderboard */}
                        <LeaderboardSection
                            title="🏫 School Leaderboard"
                            data={schoolData || []}
                            type="school"
                            isLoading={schoolLoading}
                            selectedDate={schoolDate}
                            onDateChange={setSchoolDate}
                        />
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}