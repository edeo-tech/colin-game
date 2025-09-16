'use client';

import { useState, useEffect, useRef } from 'react';
import { School } from '@/_interfaces/schools/schools';
import { useGetAllSchools } from '@/_queries/schools/schools';

interface SchoolSelectorProps {
    value?: string;
    onChange: (schoolId: string | null) => void;
    placeholder?: string;
    className?: string;
}

export default function SchoolSelector({ 
    value, 
    onChange, 
    placeholder = "Search for your school...",
    className = ""
}: SchoolSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch all schools
    const { data: schools = [], isLoading } = useGetAllSchools();

    // Filter schools based on search term
    const filteredSchools = schools.filter(school => 
        school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.county.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Set selected school based on value prop
    useEffect(() => {
        if (value && schools.length > 0) {
            const school = schools.find(s => s._id === value);
            if (school) {
                setSelectedSchool(school);
                setSearchTerm(school.school_name);
            }
        }
    }, [value, schools]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsOpen(true);
        
        // If the input is cleared, clear the selection
        if (!value) {
            setSelectedSchool(null);
            onChange(null);
        }
    };

    const handleSelectSchool = (school: School) => {
        setSelectedSchool(school);
        setSearchTerm(school.school_name);
        onChange(school._id);
        setIsOpen(false);
    };

    const handleClearSelection = () => {
        setSelectedSchool(null);
        setSearchTerm('');
        onChange(null);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10 ${className}`}
                />
                
                {/* Clear button */}
                {selectedSchool && (
                    <button
                        type="button"
                        onClick={handleClearSelection}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
                
                {/* Loading spinner */}
                {isLoading && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && !isLoading && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredSchools.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-400">
                            No schools found. Leave empty if your school is not listed.
                        </div>
                    ) : (
                        filteredSchools.map((school) => (
                            <button
                                key={school._id}
                                type="button"
                                onClick={() => handleSelectSchool(school)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition-colors"
                            >
                                <div className="font-medium text-white">{school.school_name}</div>
                                <div className="text-xs text-gray-400">
                                    {school.county}, {school.country}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}