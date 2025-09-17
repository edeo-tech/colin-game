'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminGuard from '@/components/auth/AdminGuard';
import LeaderboardSection from '@/components/leaderboard/LeaderboardSection';
import { useAdminNationalLeaderboard, useAdminSchoolLeaderboard } from '@/_queries/leaderboard/admin-leaderboard';
import Image from 'next/image';

export default function AdminLeaderboard() {
    // Date states for each leaderboard
    const [nationalDate, setNationalDate] = useState<string | null>(null);
    const [schoolDate, setSchoolDate] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    
    // Leaderboard data
    const { 
        data: nationalData, 
        isLoading: nationalLoading 
    } = useAdminNationalLeaderboard(nationalDate);
    
    const { 
        data: schoolData, 
        isLoading: schoolLoading 
    } = useAdminSchoolLeaderboard(schoolDate);

    // Particle animation for background
    const particles = Array.from({ length: 20 }, (_, i) => i);
    
    // Only run on client side to avoid SSR issues
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden relative">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse" />
                    {isClient && particles.map((particle) => (
                        <motion.div
                            key={particle}
                            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                            initial={{
                                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                                opacity: Math.random() * 0.5 + 0.3
                            }}
                            animate={{
                                y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
                                opacity: [null, Math.random() * 0.8 + 0.2]
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>

                {/* Competition Header */}
                <motion.div 
                    className="relative z-10 py-4 px-4"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        {/* Left QR Code */}
                        <motion.div 
                            className="flex-shrink-0"
                            animate={{ 
                                scale: [1, 1.05, 1],
                                rotate: [0, 1, -1, 0]
                            }}
                            transition={{ 
                                duration: 3, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="relative">
                                {/* Glowing border effect */}
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-3xl blur-lg"
                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                
                                <div className="relative bg-white rounded-3xl p-3 shadow-2xl" style={{ width: '120px', height: '120px' }}>
                                    <div className="relative w-full h-full">
                                        <Image
                                            src="/qr_code.png"
                                            alt="Scan to Play!"
                                            fill
                                            className="object-contain rounded-xl"
                                            priority
                                        />
                                    </div>
                                </div>
                                
                                {/* Call to Action */}
                                <motion.div 
                                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1 rounded-lg shadow-lg text-center"
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <p className="text-white font-bold text-sm whitespace-nowrap">📱 SCAN!</p>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Center Content */}
                        <div className="text-center flex-1">
                            {/* LIVE Competition Badge */}
                            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-500 px-3 py-2 rounded-full text-white font-bold text-base mb-3 shadow-lg shadow-red-500/30">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                <span>LIVE COMPETITION</span>
                            </div>

                            {/* Main Title - Smaller */}
                            <motion.h1 
                                className="text-4xl md:text-6xl font-black mb-2 tracking-wider"
                                style={{ 
                                    fontFamily: 'system-ui, -apple-system, sans-serif'
                                }}
                                animate={{ 
                                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <span className="text-white" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}>SGS</span>{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>X Higher Options</span>
                            </motion.h1>

                            {/* Subtitle - Smaller */}
                            <motion.p 
                                className="text-xl md:text-2xl text-yellow-400 font-bold mb-2"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                CHAMPIONSHIP
                            </motion.p>

                            {/* Prize Information - Smaller */}
                            <motion.div 
                                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400 rounded-xl p-3 inline-block shadow-lg shadow-yellow-400/20"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="text-2xl">🏆</span>
                                    <div className="text-left">
                                        <p className="text-yellow-400 font-bold text-lg">WIN AMAZING PRIZES!</p>
                                        <p className="text-white text-base">Top 3 players receive rewards</p>
                                    </div>
                                </div>
                            </motion.div>

                        </div>

                        {/* Right QR Code - Same as Left */}
                        <motion.div 
                            className="flex-shrink-0"
                            animate={{ 
                                scale: [1, 1.05, 1],
                                rotate: [0, -1, 1, 0]
                            }}
                            transition={{ 
                                duration: 3, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="relative">
                                {/* Glowing border effect */}
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-3xl blur-lg"
                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                />
                                
                                <div className="relative bg-white rounded-3xl p-3 shadow-2xl" style={{ width: '120px', height: '120px' }}>
                                    <div className="relative w-full h-full">
                                        <Image
                                            src="/qr_code.png"
                                            alt="Scan to Play!"
                                            fill
                                            className="object-contain rounded-xl"
                                            priority
                                        />
                                    </div>
                                </div>
                                
                                {/* Call to Action */}
                                <motion.div 
                                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1 rounded-lg shadow-lg text-center"
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
                                >
                                    <p className="text-white font-bold text-sm whitespace-nowrap">📱 PLAY!</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>


                {/* Main Content - TV Optimized Layout */}
                <main className="relative z-10 px-8 pb-8">
                    {/* Leaderboards Grid - Full Width for TV */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1600px] mx-auto">
                        {/* National Leaderboard */}
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <LeaderboardSection
                                title="🏆 TOP PLAYERS (BEST SCORE)"
                                data={nationalData || []}
                                type="national"
                                isLoading={nationalLoading}
                                selectedDate={nationalDate}
                                onDateChange={setNationalDate}
                            />
                        </motion.div>

                        {/* School Leaderboard */}
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <LeaderboardSection
                                title="🏫 TOP SCHOOLS (TOTAL SCORE)"
                                data={schoolData || []}
                                type="school"
                                isLoading={schoolLoading}
                                selectedDate={schoolDate}
                                onDateChange={setSchoolDate}
                            />
                        </motion.div>
                    </div>

                    {/* Bottom Call to Action */}
                    <motion.div 
                        className="text-center mt-8"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    >
                        <motion.p 
                            className="text-3xl font-bold text-white mb-2"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🎯 JOIN THE COMPETITION NOW!
                        </motion.p>
                        <p className="text-xl text-cyan-400">Scan the QR code to start playing and climb the leaderboard!</p>
                    </motion.div>
                </main>
            </div>
        </AdminGuard>
    );
}