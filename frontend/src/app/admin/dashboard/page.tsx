'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth/AuthContext';
import AdminGuard from '@/components/auth/AdminGuard';
import Link from 'next/link';
import { useGetAllSchools, useCreateSchool, useCountSchools } from '@/_queries/schools/schools';
import { IRISH_COUNTIES } from '@/_interfaces/schools/schools';

export default function AdminDashboard() {
    const { auth, logout, logoutLoading } = useAuth();
    
    // School form state
    const [schoolName, setSchoolName] = useState('');
    const [selectedCounty, setSelectedCounty] = useState('Dublin');
    const [showSchoolSuggestions, setShowSchoolSuggestions] = useState(false);
    
    // Queries
    const { data: allSchools } = useGetAllSchools();
    const { data: schoolCount } = useCountSchools();
    const createSchoolMutation = useCreateSchool();
    
    // Filter school suggestions based on input
    const schoolSuggestions = allSchools?.filter(school => 
        school.school_name.toLowerCase().includes(schoolName.toLowerCase()) &&
        school.county === selectedCounty
    ).slice(0, 5) || [];

    const handleLogout = () => {
        logout();
    };
    
    const handleCreateSchool = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!schoolName.trim()) {
            alert('Please enter a school name');
            return;
        }
        
        try {
            await createSchoolMutation.mutateAsync({
                school_name: schoolName.trim(),
                county: selectedCounty,
                country: 'Ireland'
            });
            
            // Reset form
            setSchoolName('');
            setSelectedCounty('Dublin');
            alert('School created successfully!');
        } catch (error) {
            console.error('Error creating school:', error);
            alert('Error creating school. Please try again.');
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
                                    href="/home"
                                    className="text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    ←
                                </Link>
                                <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
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
                </nav>

                {/* Main Content */}
                <main className="max-w-4xl mx-auto px-4 py-8">
                    {/* School Creation Form */}
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Create New School</h2>
                        
                        <form onSubmit={handleCreateSchool} className="space-y-6">
                            {/* County Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    County
                                </label>
                                <select
                                    value={selectedCounty}
                                    onChange={(e) => setSelectedCounty(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                                             text-white focus:border-blue-500 focus:outline-none transition-colors"
                                >
                                    {IRISH_COUNTIES.map(county => (
                                        <option key={county} value={county}>{county}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* School Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    School Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={schoolName}
                                        onChange={(e) => {
                                            setSchoolName(e.target.value);
                                            setShowSchoolSuggestions(true);
                                        }}
                                        onBlur={() => setTimeout(() => setShowSchoolSuggestions(false), 200)}
                                        placeholder="Enter school name..."
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                                                 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                    
                                    {/* School Suggestions Dropdown */}
                                    {showSchoolSuggestions && schoolName && schoolSuggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 
                                                      rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                                            <div className="p-2 text-xs text-gray-400 border-b border-gray-600">
                                                Similar schools in {selectedCounty}:
                                            </div>
                                            {schoolSuggestions.map((school, index) => (
                                                <button
                                                    key={school._id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSchoolName(school.school_name);
                                                        setShowSchoolSuggestions(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-600 
                                                             transition-colors text-sm"
                                                >
                                                    {school.school_name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={createSchoolMutation.isPending || !schoolName.trim()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 
                                         rounded-lg transition-colors duration-200 disabled:opacity-50 
                                         disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {createSchoolMutation.isPending ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    'Create School'
                                )}
                            </button>
                        </form>
                        
                        {/* Info Section */}
                        <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                            <p className="text-sm text-gray-400">
                                <strong>Total Schools:</strong> {schoolCount || 0} schools in the database
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Tip: Start typing to see existing schools and avoid creating duplicates.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}