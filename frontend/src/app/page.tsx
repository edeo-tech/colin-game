'use client';

import { useAuth } from '@/context/auth/AuthContext';

export default function LandingPage() {
  const { authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome</h1>
        <p className="text-gray-300 mb-8">Authentication is being handled...</p>
      </div>
    </div>
  );
}
