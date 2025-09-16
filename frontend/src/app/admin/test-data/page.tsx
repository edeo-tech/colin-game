'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth/AuthContext';
import AdminGuard from '@/components/auth/AdminGuard';
import Link from 'next/link';
import { useSubmitScore, useTestAddSchoolScore } from '@/_queries/leaderboard/leaderboard';
import { useGetAllSchools } from '@/_queries/schools/schools';

export default function AdminTestData() {
    const { auth } = useAuth();
    
    // Form states
    const [nationalForm, setNationalForm] = useState({
        username: '',
        score: ''
    });
    
    const [schoolForm, setSchoolForm] = useState({
        username: '',
        score: '',
        school_id: ''
    });
    
    // Quick test data
    const [quickTestRunning, setQuickTestRunning] = useState(false);
    
    // Queries
    const { data: schools } = useGetAllSchools();
    const submitScoreMutation = useSubmitScore();
    const testSchoolScoreMutation = useTestAddSchoolScore();

    const handleNationalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nationalForm.username.trim() || !nationalForm.score) {
            alert('Please fill in all fields');
            return;
        }
        
        try {
            await submitScoreMutation.mutateAsync({
                user_id: `fake-${Date.now()}`, // Generate fake user ID
                username: nationalForm.username.trim(),
                score: parseInt(nationalForm.score)
            });
            
            alert('National entry created successfully!');
            setNationalForm({ username: '', score: '' });
        } catch (error) {
            console.error('Error creating national entry:', error);
            alert('Error creating entry. Check console for details.');
        }
    };

    const handleSchoolSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!schoolForm.score || !schoolForm.school_id) {
            alert('Please select a school and enter a score');
            return;
        }
        
        try {
            await testSchoolScoreMutation.mutateAsync({
                schoolId: schoolForm.school_id,
                scoreToAdd: parseInt(schoolForm.score)
            });
            
            alert('School score added successfully!');
            setSchoolForm({ username: '', score: '', school_id: '' });
        } catch (error) {
            console.error('Error adding school score:', error);
            alert('Error adding school score. Check console for details.');
        }
    };

    const runQuickTest = async () => {
        setQuickTestRunning(true);
        
        const testEntries = [
            { username: 'TestUser1', score: 95 },
            { username: 'TestUser2', score: 87 },
            { username: 'TestUser3', score: 92 },
            { username: 'TestUser4', score: 89 },
            { username: 'TestUser5', score: 94 }
        ];
        
        try {
            for (let i = 0; i < testEntries.length; i++) {
                const entry = testEntries[i];
                
                // Add some delay between submissions
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                await submitScoreMutation.mutateAsync({
                    user_id: `quick-test-${Date.now()}-${i}`,
                    username: entry.username,
                    score: entry.score
                });
            }
            
            alert('Quick test data created! Check the leaderboard for animations.');
        } catch (error) {
            console.error('Error in quick test:', error);
            alert('Error in quick test. Check console for details.');
        } finally {
            setQuickTestRunning(false);
        }
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
                                    href="/admin/leaderboard"
                                    className="text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    ←
                                </Link>
                                <h1 className="text-xl font-semibold text-white">Test Data Generator</h1>
                                <span className="text-yellow-500 text-sm bg-yellow-900/20 px-2 py-1 rounded">ADMIN</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-300 hidden sm:block">
                                    Welcome, {auth?.username}! 
                                    <span className="text-gray-400 text-sm ml-2">({auth?.role})</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                    {/* Header */}
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Leaderboard Test Data Generator</h2>
                        <p className="text-gray-300 text-sm">
                            Create fake leaderboard entries to test animations and functionality. Open the leaderboard in another tab to see real-time updates.
                        </p>
                    </div>

                    {/* Quick Test */}
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Quick Test</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Generate 5 test entries with staggered timing to see animations in action.
                        </p>
                        <button
                            onClick={runQuickTest}
                            disabled={quickTestRunning || submitScoreMutation.isPending}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 
                                     rounded-lg transition-colors duration-200 disabled:opacity-50 
                                     disabled:cursor-not-allowed flex items-center"
                        >
                            {quickTestRunning ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating test data...
                                </>
                            ) : (
                                'Run Quick Test'
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* National Leaderboard Form */}
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Add National Entry</h3>
                            
                            <form onSubmit={handleNationalSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={nationalForm.username}
                                        onChange={(e) => setNationalForm(prev => ({ ...prev, username: e.target.value }))}
                                        placeholder="Enter username..."
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                                                 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Score
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={nationalForm.score}
                                        onChange={(e) => setNationalForm(prev => ({ ...prev, score: e.target.value }))}
                                        placeholder="Enter score (0-100)..."
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                                                 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={submitScoreMutation.isPending}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 
                                             rounded-lg transition-colors duration-200 disabled:opacity-50 
                                             disabled:cursor-not-allowed"
                                >
                                    {submitScoreMutation.isPending ? 'Creating...' : 'Add National Entry'}
                                </button>
                            </form>
                        </div>

                        {/* School Leaderboard Form */}
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Add School Score</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Directly add points to a school's leaderboard total for testing animations.
                            </p>
                            
                            <form onSubmit={handleSchoolSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        School
                                    </label>
                                    <select
                                        value={schoolForm.school_id}
                                        onChange={(e) => setSchoolForm(prev => ({ ...prev, school_id: e.target.value }))}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                                                 text-white focus:border-blue-500 focus:outline-none transition-colors"
                                    >
                                        <option value="">Select a school...</option>
                                        {schools?.map(school => (
                                            <option key={school._id} value={school._id}>
                                                {school.school_name} ({school.county})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Points to Add
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="1000"
                                        value={schoolForm.score}
                                        onChange={(e) => setSchoolForm(prev => ({ ...prev, score: e.target.value }))}
                                        placeholder="Enter points to add (1-1000)..."
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                                                 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={testSchoolScoreMutation.isPending}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 
                                             rounded-lg transition-colors duration-200 disabled:opacity-50 
                                             disabled:cursor-not-allowed"
                                >
                                    {testSchoolScoreMutation.isPending ? 'Adding Points...' : 'Add Points to School'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-900/20 border border-blue-700/50 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-blue-400 mb-3">Testing Instructions</h3>
                        <div className="space-y-2 text-sm text-gray-300">
                            <p>• Open the admin leaderboard in another tab to see real-time updates</p>
                            <p>• Use "Quick Test" to see multiple entries animate in sequence</p>
                            <p>• Add individual entries with different scores to test position changes</p>
                            <p>• Create entries for the same user/school with higher scores to see ranking updates</p>
                            <p>• The leaderboard updates every 10 seconds automatically</p>
                        </div>
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}