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
    selectedDate,
    onDateChange
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

    const formatDateForInput = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleDateChange = (dateStr: string) => {
        if (dateStr === '') {
            onDateChange(null); // All time
        } else {
            onDateChange(dateStr);
        }
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                
                {/* Controls */}
                <div className="flex items-center space-x-4">
                    {/* Date Picker */}
                    <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-400">Date:</label>
                        <select
                            value={selectedDate || ''}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">All Time</option>
                            <option value={formatDateForInput(new Date())}>Today</option>
                            <option value={formatDateForInput(new Date(Date.now() - 86400000))}>Yesterday</option>
                        </select>
                        
                        {/* Custom Date Input */}
                        <input
                            type="date"
                            value={selectedDate || ''}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    
                    {/* Search Toggle */}
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-1 rounded text-sm transition-colors"
                        title="Ctrl+F to toggle search"
                    >
                        🔍
                    </button>
                </div>
            </div>

            {/* Search Input */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4"
                    >
                        <input
                            id={`search-${type}`}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={`Search by ${type === 'national' ? 'username' : 'school name'}...`}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            Press Ctrl+F to toggle search, Esc to close
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <div className="text-gray-400">Loading...</div>
                </div>
            )}

            {/* Leaderboard Entries */}
            {!isLoading && (
                <div className="space-y-3">
                    {filteredData.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            {searchTerm ? 'No results found' : 'No entries available'}
                        </div>
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

            {/* Footer Info */}
            {!isLoading && filteredData.length > 0 && (
                <div className="mt-4 text-sm text-gray-500 text-center">
                    {searchTerm && (
                        <span>Showing {filteredData.length} matching entries • </span>
                    )}
                    {/* Updates every 10 seconds */}
                </div>
            )}
        </div>
    );
}