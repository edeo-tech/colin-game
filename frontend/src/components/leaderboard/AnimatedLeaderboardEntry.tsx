'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth/AuthContext';
import { UserRole } from '@/_interfaces/users/user-role';
import { useAddBonusPoints, useDeleteEntry } from '@/_queries/leaderboard/admin-leaderboard';

export interface LeaderboardEntryData {
    id: string;
    position: number;
    username?: string;
    school_name?: string;
    county?: string;
    score: number;
    type?: 'national' | 'school';
    user_count?: number;
}

interface AnimatedLeaderboardEntryProps {
    entry: LeaderboardEntryData;
    previousPosition?: number;
    isNew?: boolean;
    type: 'national' | 'school';
}

export default function AnimatedLeaderboardEntry({ 
    entry, 
    previousPosition, 
    isNew = false,
    type
}: AnimatedLeaderboardEntryProps) {
    const { auth } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const [bonusPoints, setBonusPoints] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [animatedOpacity, setAnimatedOpacity] = useState(0);
    
    const addBonusPointsMutation = useAddBonusPoints();
    const deleteEntryMutation = useDeleteEntry();
    
    const isAdmin = auth?.role === UserRole.ADMIN;
    
    const handleBonusPointsSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const points = parseInt(bonusPoints);
            if (!isNaN(points) && points !== 0) {
                addBonusPointsMutation.mutate({
                    entryId: entry.id,
                    bonusPoints: points,
                    entryType: type
                });
                setBonusPoints('');
            }
        }
    };
    
    const handleDeleteEntry = () => {
        deleteEntryMutation.mutate({
            entryId: entry.id,
            entryType: type
        });
        setShowDeleteConfirm(false);
    };
    
    // Determine animation state based on position comparison
    const getAnimationState = (): 'stable' | 'moving-up' | 'moving-down' | 'new-entry' => {
        if (isNew) {
            return 'new-entry';
        } else if (previousPosition !== undefined && previousPosition !== entry.position) {
            if (previousPosition > entry.position) {
                return 'moving-up'; // Lower position number = higher rank = moving up
            } else {
                return 'moving-down'; // Higher position number = lower rank = moving down
            }
        }
        return 'stable';
    };


    const animationState = getAnimationState();
    
    // Handle flash animation timing
    useEffect(() => {
        if (animationState !== 'stable') {
            // Start with opacity 0.2
            setAnimatedOpacity(0.2);
            
            // Hold the flash for 500ms, then fade out over 1 second
            const timer = setTimeout(() => {
                setAnimatedOpacity(0);
            }, 500);
            
            return () => clearTimeout(timer);
        } else {
            setAnimatedOpacity(0);
        }
    }, [animationState]);



    const getStatusIcon = () => {
        if (animationState === 'stable') return null;
        
        switch (animationState) {
            case 'moving-up':
                return (
                    <motion.div
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-green-400 text-xl font-bold"
                    >
                        ↑
                    </motion.div>
                );
            case 'moving-down':
                return (
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-red-400 text-xl font-bold"
                    >
                        ↓
                    </motion.div>
                );
            case 'new-entry':
                return (
                    <motion.div
                        initial={{ scale: 0, rotate: 360 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-yellow-400 text-xl font-bold"
                    >
                        ★
                    </motion.div>
                );
            default:
                return null;
        }
    };


    const getInitialAnimation = () => {
        if (animationState === 'new-entry') {
            return { opacity: 0, x: -100, y: 0 }; // New entries slide in from left
        } else if (animationState === 'moving-up') {
            return { opacity: 1, x: 0, y: 30 }; // Moving up starts from below
        } else if (animationState === 'moving-down') {
            return { opacity: 1, x: 0, y: -30 }; // Moving down starts from above
        }
        return { opacity: 1, x: 0, y: 0 }; // Default stable state
    };

    const getAnimateProps = () => {
        // Always animate to a clean, reset state
        return { opacity: 1, x: 0, y: 0 };
    };

    const getPositionStyles = () => {
        if (entry.position === 1) {
            return "from-yellow-500/30 to-orange-500/30 border-yellow-400/60 shadow-yellow-400/30";
        } else if (entry.position === 2) {
            return "from-gray-400/30 to-gray-500/30 border-gray-300/60 shadow-gray-400/30";
        } else if (entry.position === 3) {
            return "from-orange-400/30 to-orange-600/30 border-orange-400/60 shadow-orange-400/30";
        } else {
            return "from-gray-700/50 to-gray-800/50 border-cyan-500/30 shadow-cyan-500/20";
        }
    };

    const getPositionEmoji = () => {
        if (entry.position === 1) return "🥇";
        if (entry.position === 2) return "🥈";  
        if (entry.position === 3) return "🥉";
        return "🎯";
    };

    return (
        <motion.div
            key={entry.id}
            layout
            initial={getInitialAnimation()}
            animate={getAnimateProps()}
            exit={{ opacity: 0, x: -50 }}
            transition={{ 
                duration: 0.6,
                ease: "easeInOut"
            }}
            className="relative overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setShowDeleteConfirm(false);
            }}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
            <motion.div 
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getPositionStyles()}`}
                animate={{ opacity: entry.position <= 3 ? [0.3, 0.5, 0.3] : 0.2 }}
                transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Glowing border for top 3 */}
            {entry.position <= 3 && (
                <motion.div 
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getPositionStyles()} blur-sm`}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}

            {/* Animation State Background */}
            <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                    backgroundColor: `rgba(${
                        animationState === 'moving-up' ? '34, 197, 94' : 
                        animationState === 'moving-down' ? '239, 68, 68' : 
                        animationState === 'new-entry' ? '234, 179, 8' : '0, 0, 0'
                    }, ${animatedOpacity})`,
                    transition: 'background-color 1s ease-out'
                }}
            />

            {/* Main Content */}
            <div className={`relative bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-black/95 border-2 ${
                animatedOpacity > 0 ? (
                    animationState === 'moving-up' ? 'border-green-400' : 
                    animationState === 'moving-down' ? 'border-red-400' : 
                    animationState === 'new-entry' ? 'border-yellow-400' : 'border-cyan-500/30'
                ) : (entry.position <= 3 ? 
                    entry.position === 1 ? 'border-yellow-400/60' :
                    entry.position === 2 ? 'border-gray-300/60' :
                    'border-orange-400/60' : 'border-cyan-500/30')
            } rounded-2xl p-4 shadow-2xl ${entry.position <= 3 ? `shadow-${entry.position === 1 ? 'yellow' : entry.position === 2 ? 'gray' : 'orange'}-400/30` : 'shadow-cyan-500/20'} backdrop-blur-sm transition-all duration-500`}
        >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Position with Medal/Emoji - Smaller */}
                        <div className="flex items-center space-x-2">
                            <div className="text-2xl">
                                {getPositionEmoji()}
                            </div>
                            <motion.div 
                                className={`text-2xl font-black ${
                                    entry.position === 1 ? 'text-yellow-400' :
                                    entry.position === 2 ? 'text-gray-300' :
                                    entry.position === 3 ? 'text-orange-400' :
                                    'text-cyan-400'
                                }`}
                                style={{ 
                                    textShadow: `0 0 8px ${
                                        entry.position === 1 ? 'rgba(251, 191, 36, 0.6)' :
                                        entry.position === 2 ? 'rgba(209, 213, 219, 0.6)' :
                                        entry.position === 3 ? 'rgba(251, 146, 60, 0.6)' :
                                        'rgba(6, 182, 212, 0.6)'
                                    }`
                                }}
                            >
                                #{entry.position}
                            </motion.div>
                        </div>
                        
                        {/* Name with Gaming Typography - Smaller */}
                        <div className="flex flex-col">
                            <motion.div 
                                className={`text-lg font-bold ${
                                    entry.position <= 3 ? 'text-white' : 'text-gray-100'
                                }`}
                                style={{ 
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                    textShadow: entry.position <= 3 ? '0 0 6px rgba(255, 255, 255, 0.3)' : 'none'
                                }}
                            >
                                {type === 'national' ? entry.username : entry.school_name}
                            </motion.div>
                            {type === 'school' && (
                                <div className="flex items-center space-x-3">
                                    {entry.county && (
                                        <div className="text-xs text-purple-400 font-medium">
                                            📍 {entry.county}
                                        </div>
                                    )}
                                    {'user_count' in entry && entry.user_count && (
                                        <div className="text-xs text-cyan-400 font-medium">
                                            👥 {entry.user_count} players
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {/* Status Icon with Enhanced Animation - Smaller */}
                        <div className="w-8 flex justify-center">
                            {getStatusIcon()}
                        </div>
                        
                        {/* Score with Gaming Style - Smaller */}
                        <div className="text-right">
                            <motion.div 
                                className={`text-2xl font-black ${
                                    entry.position === 1 ? 'text-yellow-400' :
                                    entry.position === 2 ? 'text-gray-300' :
                                    entry.position === 3 ? 'text-orange-400' :
                                    'text-blue-400'
                                }`}
                                style={{ 
                                    textShadow: `0 0 10px ${
                                        entry.position === 1 ? 'rgba(251, 191, 36, 0.6)' :
                                        entry.position === 2 ? 'rgba(209, 213, 219, 0.6)' :
                                        entry.position === 3 ? 'rgba(251, 146, 60, 0.6)' :
                                        'rgba(59, 130, 246, 0.6)'
                                    }`
                                }}
                                animate={entry.position <= 3 ? { 
                                    scale: [1, 1.05, 1] 
                                } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {entry.score.toLocaleString()}
                            </motion.div>
                            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                {type === 'national' ? '⚡ POINTS' : '🏆 TOTAL'}
                            </div>
                        </div>

                        {/* Rank Badge for Top 10 - Smaller */}
                        {entry.position <= 10 && (
                            <motion.div
                                className={`px-2 py-1 rounded-full font-bold text-xs ${
                                    entry.position <= 3 ? 
                                        'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30' :
                                        'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                                }`}
                                whileHover={{ scale: 1.1 }}
                            >
                                TOP {entry.position <= 3 ? '3' : '10'}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Enhanced Admin Overlay */}
            {isAdmin && isHovered && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 flex items-center justify-center space-x-6 rounded-2xl backdrop-blur-sm border-2 border-red-500/50"
                >
                    {/* Bonus Points Input - Gaming Style */}
                    <div className="flex items-center space-x-3">
                        <span className="text-cyan-400 font-bold text-sm">💰 BONUS:</span>
                        <input
                            type="number"
                            value={bonusPoints}
                            onChange={(e) => setBonusPoints(e.target.value)}
                            onKeyDown={handleBonusPointsSubmit}
                            placeholder="±Points"
                            className="w-24 px-3 py-2 text-sm bg-gradient-to-r from-gray-700 to-gray-800 border-2 border-cyan-500/50 rounded-lg text-white placeholder-gray-300 font-medium focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 shadow-lg"
                            disabled={addBonusPointsMutation.isPending}
                        />
                        <span className="text-green-400 text-xs font-bold">⏎ ENTER</span>
                    </div>
                    
                    {/* Delete Button - Gaming Style */}
                    {!showDeleteConfirm ? (
                        <motion.button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm rounded-lg transition-all duration-200 shadow-lg shadow-red-500/30"
                            disabled={deleteEntryMutation.isPending}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🗑️ DELETE
                        </motion.button>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <span className="text-red-400 font-bold text-sm">⚠️ CONFIRM?</span>
                            <motion.button
                                onClick={handleDeleteEntry}
                                className="px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs rounded-lg shadow-lg"
                                disabled={deleteEntryMutation.isPending}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                ✓ YES
                            </motion.button>
                            <motion.button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold text-xs rounded-lg shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                ✗ NO
                            </motion.button>
                        </div>
                    )}
                    
                    {/* Loading indicator - Gaming Style */}
                    {(addBonusPointsMutation.isPending || deleteEntryMutation.isPending) && (
                        <motion.div 
                            className="flex items-center space-x-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.div
                                className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <span className="text-cyan-400 font-bold text-sm">⚡ PROCESSING...</span>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}