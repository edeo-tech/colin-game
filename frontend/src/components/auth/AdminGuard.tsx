'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth/AuthContext';
import { UserRole } from '@/_interfaces/users/user-role';

interface AdminGuardProps {
    children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
    const { auth, authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect if not admin after loading is complete
        if (!authLoading && (!auth || auth.role !== UserRole.ADMIN)) {
            router.push('/home');
        }
    }, [auth, authLoading, router]);

    // Show loading state while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    // Don't render children if not admin
    if (!auth || auth.role !== UserRole.ADMIN) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="text-red-400 text-xl mb-4">Access Denied</div>
                    <div className="text-gray-300">You don&apos;t have permission to view this page.</div>
                </div>
            </div>
        );
    }

    // Render children if user is admin
    return <>{children}</>;
}