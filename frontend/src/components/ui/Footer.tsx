import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth/AuthContext';

export default function Footer() {
  const { auth } = useAuth();

  const generateGameGenUrl = () => {
    const baseUrl = 'https://edugamegen.netlify.app';
    if (!auth) return baseUrl;

    const params = new URLSearchParams();
    if (auth.username) params.append('username', auth.username);
    if (auth.email) params.append('email', auth.email);
    
    // Get school name from localStorage
    const schoolName = localStorage.getItem('selectedSchoolName');
    if (schoolName) params.append('school', schoolName);

    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  return (
    <footer className="w-full bg-gray-800 border-t border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="text-center text-gray-300 text-sm">
          Powered by:{' '}
          <Link
            href={generateGameGenUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline transition-colors"
          >
            edugamegen.netlify.app
          </Link>
        </div>
      </div>
    </footer>
  );
}