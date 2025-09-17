'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedLeaderboardEntry, { LeaderboardEntryData } from './AnimatedLeaderboardEntry';
import { NationalLeaderboardEntry, SchoolLeaderboardEntry } from '@/_interfaces/leaderboard/leaderboard';

interface LeaderboardSectionProps {
    title: string;
    data: NationalLeaderboardEntry[] | SchoolLeaderboardEntry[];
    type: 'national' | 'school';
    isLoading: boolean;
    selectedDate: string | null;
    onDateChange: (date: string | null) => void;
}

export default function LeaderboardSection({
    title,
    data,
    type,
    isLoading,
    selectedDate: _selectedDate, // eslint-disable-line @typescript-eslint/no-unused-vars
    onDateChange: _onDateChange // eslint-disable-line @typescript-eslint/no-unused-vars
}: LeaderboardSectionProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [previousPositions, setPreviousPositions] = useState<Map<string, number>>(new Map());
    const [newEntries, setNewEntries] = useState<Set<string>>(new Set());

    // Transform data to include positions
    const transformedData: LeaderboardEntryData[] = useMemo(() => {
        if (!data || data.length === 0) return [];
        
        return data.map((entry, index) => {
            if (type === 'national') {
                const nationalEntry = entry as NationalLeaderboardEntry;
                return {
                    id: nationalEntry.id,
                    position: index + 1,
                    username: nationalEntry.username,
                    score: nationalEntry.score,
                    user_id: nationalEntry.user_id,
                    created_at: nationalEntry.created_at,
                    updated_at: nationalEntry.updated_at
                };
            } else {
                const schoolEntry = entry as SchoolLeaderboardEntry;
                return {
                    id: schoolEntry.id,
                    position: index + 1,
                    school_name: schoolEntry.school_name,
                    county: schoolEntry.county,
                    score: schoolEntry.total_score,
                    school_id: schoolEntry.school_id,
                    user_count: schoolEntry.user_count,
                    created_at: schoolEntry.created_at,
                    updated_at: schoolEntry.updated_at
                };
            }
        });
    }, [data, type]);


    // Track position changes and new entries
    useEffect(() => {
        if (transformedData && transformedData.length > 0) {
            const currentPositions = new Map<string, number>();
            const currentNewEntries = new Set<string>();

            transformedData.forEach((entry) => {
                const entryId = entry.id;
                const currentPosition = entry.position;
                
                currentPositions.set(entryId, currentPosition);
                
                // Check if this is a new entry
                if (!previousPositions.has(entryId)) {
                    currentNewEntries.add(entryId);
                }
            });

            setNewEntries(currentNewEntries);
            
            // Clear new entries after animation to ensure they can trigger again next polling cycle
            const timer = setTimeout(() => {
                setNewEntries(new Set());
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [transformedData, previousPositions]);

    // Update previous positions after tracking new entries, with a delay to ensure animations complete
    useEffect(() => {
        if (transformedData && transformedData.length > 0) {
            // Delay updating previous positions to ensure current animation cycle completes
            const timer = setTimeout(() => {
                const positions = new Map<string, number>();
                transformedData.forEach((entry) => {
                    positions.set(entry.id, entry.position);
                });
                setPreviousPositions(positions);
            }, 100); // Small delay to ensure current animations are processed first
            
            return () => clearTimeout(timer);
        }
    }, [transformedData]);

    // Filter data based on search term while preserving positions
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return transformedData;
        
        const searchLower = searchTerm.toLowerCase();
        return transformedData.filter((entry) => {
            const searchField = type === 'national' ? entry.username : entry.school_name;
            return searchField?.toLowerCase().includes(searchLower);
        });
    }, [transformedData, searchTerm, type]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
                event.preventDefault();
                setShowSearch(!showSearch);
                if (!showSearch) {
                    // Focus search input after a short delay to ensure it's rendered
                    setTimeout(() => {
                        const searchInput = document.getElementById(`search-${type}`);
                        searchInput?.focus();
                    }, 100);
                }
            }
            if (event.key === 'Escape' && showSearch) {
                setShowSearch(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showSearch, type]);


    return (
        <motion.div 
            className="relative overflow-hidden rounded-3xl shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 animate-pulse" />
            
            {/* Glowing Border Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/20 to-purple-500/20 blur-sm" />
            
            <div className="relative bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-black/95 border border-cyan-500/30 rounded-3xl p-6 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <motion.h3 
                        className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
                        style={{ 
                            textShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}
                        animate={{ 
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        {title}
                    </motion.h3>
                    
                    {/* Live Indicator */}
                    <motion.div
                        className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-500 px-3 py-1 rounded-full text-white font-bold text-sm shadow-lg shadow-green-500/30"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span>LIVE</span>
                    </motion.div>
                </div>

                {/* Gaming-Style Controls - Search Only */}
                <div className="flex items-center justify-end mb-6">
                    {/* Search Toggle - Gaming Style */}
                    <motion.button
                        onClick={() => setShowSearch(!showSearch)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-500/30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Ctrl+F to toggle search"
                    >
                        🔍 SEARCH
                    </motion.button>
                </div>

                {/* Gaming-Style Search Input */}
                <AnimatePresence>
                    {showSearch && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, scale: 0.9 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.9 }}
                            className="mb-6"
                        >
                            <div className="relative">
                                <input
                                    id={`search-${type}`}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={`🔍 SEARCH ${type === 'national' ? 'PLAYERS' : 'SCHOOLS'}...`}
                                    className="w-full bg-gradient-to-r from-gray-700 to-gray-800 border-2 border-purple-500/50 rounded-xl px-5 py-3 text-white placeholder-gray-300 font-medium text-lg focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 shadow-lg shadow-purple-500/20"
                                />
                                <motion.div 
                                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 pointer-events-none"
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                            <div className="text-sm text-cyan-400 mt-2 font-medium">
                                ⌨️ Press Ctrl+F to toggle • ESC to close
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Gaming Loading State */}
                {isLoading && (
                    <motion.div 
                        className="flex flex-col items-center justify-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mb-4"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div 
                            className="text-xl font-bold text-cyan-400"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            ⚡ LOADING RANKINGS...
                        </motion.div>
                        <div className="text-sm text-gray-400 mt-2">Fetching live data</div>
                    </motion.div>
                )}

                {/* Enhanced Leaderboard Entries */}
                {!isLoading && (
                    <div className="space-y-2">
                        {filteredData.length === 0 ? (
                            <motion.div 
                                className="text-center py-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="text-6xl mb-4">🎯</div>
                                <div className="text-xl font-bold text-gray-300 mb-2">
                                    {searchTerm ? '❌ NO RESULTS FOUND' : '🏁 NO ENTRIES YET'}
                                </div>
                                <div className="text-gray-400">
                                    {searchTerm ? 'Try a different search term' : 'Be the first to join the competition!'}
                                </div>
                            </motion.div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {filteredData.map((entry) => (
                                    <AnimatedLeaderboardEntry
                                        key={entry.id}
                                        entry={entry}
                                        previousPosition={previousPositions.get(entry.id)}
                                        isNew={newEntries.has(entry.id)}
                                        type={type}
                                    />
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                )}

                {/* Gaming-Style Footer */}
                {!isLoading && filteredData.length > 0 && (
                    <motion.div 
                        className="mt-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-cyan-500/30 rounded-xl p-3">
                            <div className="flex items-center justify-center space-x-4 text-sm font-medium">
                                {searchTerm && (
                                    <span className="text-yellow-400">
                                        🎯 {filteredData.length} RESULTS
                                    </span>
                                )}
                                <motion.span 
                                    className="text-green-400"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    🔄 AUTO-REFRESH: 10s
                                </motion.span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}