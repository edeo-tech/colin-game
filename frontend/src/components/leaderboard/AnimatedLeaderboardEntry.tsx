'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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
    const [animationState, setAnimationState] = useState<'stable' | 'moving-up' | 'moving-down' | 'new-entry'>('stable');
    
    useEffect(() => {
        if (isNew) {
            setAnimationState('new-entry');
            const timer = setTimeout(() => setAnimationState('stable'), 2000);
            return () => clearTimeout(timer);
        } else if (previousPosition && previousPosition !== entry.position) {
            if (previousPosition > entry.position) {
                setAnimationState('moving-up');
            } else {
                setAnimationState('moving-down');
            }
            const timer = setTimeout(() => setAnimationState('stable'), 2000);
            return () => clearTimeout(timer);
        }
    }, [entry.position, previousPosition, isNew]);

    const getAnimationClass = () => {
        switch (animationState) {
            case 'moving-up':
                return 'bg-green-900/50 border-green-700';
            case 'moving-down':
                return 'bg-red-900/50 border-red-700';
            case 'new-entry':
                return 'bg-yellow-900/50 border-yellow-700';
            default:
                return 'bg-gray-800 border-gray-700';
        }
    };

    const getPositionChangeIndicator = () => {
        if (!previousPosition || previousPosition === entry.position) return null;
        
        const change = previousPosition - entry.position;
        if (change > 0) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-green-400 text-xs flex items-center"
                >
                    ↑ +{change}
                </motion.div>
            );
        } else {
            return (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-xs flex items-center"
                >
                    ↓ {change}
                </motion.div>
            );
        }
    };

    return (
        <motion.div
            layout
            initial={isNew ? { opacity: 0, x: 50 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ 
                duration: 0.5,
                ease: "easeInOut"
            }}
            className={`p-4 rounded-xl border transition-all duration-500 ${getAnimationClass()}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Position */}
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold text-white">
                            #{entry.position}
                        </div>
                        {getPositionChangeIndicator()}
                    </div>
                    
                    {/* Name */}
                    <div>
                        <div className="text-lg font-semibold text-white">
                            {type === 'national' ? entry.username : entry.school_name}
                        </div>
                        {isNew && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-yellow-400 text-xs font-medium"
                            >
                                NEW ENTRY
                            </motion.div>
                        )}
                    </div>
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
        </motion.div>
    );
}