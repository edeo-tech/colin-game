'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth/AuthContext';
import Link from 'next/link';
import SchoolSelector from '@/components/SchoolSelector';

export default function Register() {
    const { register, registerLoading, registerError } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        last_lat: 0,
        last_long: 0,
        device_os: 'web',
        school_id: undefined as string | undefined
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Or{' '}
                        <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
                            sign in to your existing account
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your password"
                            />
                        </div>
                        <div>
                            <label htmlFor="school" className="block text-sm font-medium text-gray-300">
                                School (Optional)
                            </label>
                            <SchoolSelector
                                value={formData.school_id}
                                onChange={(schoolId) => setFormData(prev => ({ ...prev, school_id: schoolId || undefined }))}
                                className="mt-1"
                            />
                            <p className="mt-1 text-xs text-gray-400">
                                Struggling to find your school? Ask Colin or Ross to add it.
                            </p>
                        </div>
                    </div>

                    {registerError && (
                        <div className="rounded-md bg-red-900 border border-red-700 p-4">
                            <div className="text-sm text-red-300">
                                {registerError.message}
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={registerLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {registerLoading ? 'Creating account...' : 'Create account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}