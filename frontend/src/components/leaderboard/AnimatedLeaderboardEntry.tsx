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
    score: number;
    [key: string]: any;
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
            
            // Fade out after 1 second (matching your CSS transition duration)
            const timer = setTimeout(() => {
                setAnimatedOpacity(0);
            }, 1000);
            
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
            className="p-4 rounded-xl border border-gray-700 relative overflow-hidden group"
            style={{
                backgroundColor: `rgba(${
                    animationState === 'moving-up' ? '34, 197, 94' : 
                    animationState === 'moving-down' ? '239, 68, 68' : 
                    animationState === 'new-entry' ? '234, 179, 8' : '0, 0, 0'
                }, ${animatedOpacity})`,
                borderColor: animatedOpacity > 0 ? (
                    animationState === 'moving-up' ? 'rgb(74, 222, 128)' : 
                    animationState === 'moving-down' ? 'rgb(248, 113, 113)' : 
                    animationState === 'new-entry' ? 'rgb(250, 204, 21)' : 'rgb(55, 65, 81)'
                ) : 'rgb(55, 65, 81)',
                transition: 'background-color 1s ease-out, border-color 1s ease-out'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setShowDeleteConfirm(false);
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Position */}
                    <div className="text-2xl font-bold text-white">
                        #{entry.position}
                    </div>
                    
                    {/* Name */}
                    <div className="text-lg font-semibold text-white">
                        {type === 'national' ? entry.username : entry.school_name}
                    </div>
                </div>
                
                <div className="flex items-center space-x-4">
                    {/* Status Icon */}
                    <div className="w-8 flex justify-center">
                        {getStatusIcon()}
                    </div>
                    
                    {/* Score */}
                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">
                            {entry.score}
                        </div>
                        <div className="text-sm text-gray-400">
                            {type === 'national' ? 'points' : 'total score'}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Admin Overlay */}
            {isAdmin && isHovered && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center space-x-4 rounded-xl"
                >
                    {/* Bonus Points Input */}
                    <div className="flex items-center space-x-2">
                        <span className="text-white text-sm">Bonus:</span>
                        <input
                            type="number"
                            value={bonusPoints}
                            onChange={(e) => setBonusPoints(e.target.value)}
                            onKeyDown={handleBonusPointsSubmit}
                            placeholder="±Points"
                            className="w-20 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            disabled={addBonusPointsMutation.isPending}
                        />
                        <span className="text-gray-400 text-xs">Enter</span>
                    </div>
                    
                    {/* Delete Button */}
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                            disabled={deleteEntryMutation.isPending}
                        >
                            Delete
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <span className="text-red-400 text-sm">Confirm?</span>
                            <button
                                onClick={handleDeleteEntry}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                                disabled={deleteEntryMutation.isPending}
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded"
                            >
                                No
                            </button>
                        </div>
                    )}
                    
                    {/* Loading indicator */}
                    {(addBonusPointsMutation.isPending || deleteEntryMutation.isPending) && (
                        <div className="text-blue-400 text-sm">Processing...</div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}