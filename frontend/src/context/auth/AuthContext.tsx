'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthenticatedUser, LoginUser, RegisterUser } from '@/_interfaces/users/auth';
import { useCheckAuth, useLogin, useLogout, useRegister } from '@/_queries/users/auth/users';
import { getUserName } from '@/utils/cookies';

type AuthContextType = {
    auth: AuthenticatedUser | undefined;
    authLoading: boolean;
    login: (body: LoginUser) => void;
    register: (body: RegisterUser) => void;
    logout: () => void;
    loginLoading: boolean;
    registerLoading: boolean;
    logoutLoading: boolean;
    loginError: Error | null;
    registerError: Error | null;
    logoutError: Error | null;
    loginSuccess: boolean;
    registerSuccess: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [hasNavigated, setHasNavigated] = useState(false);
    
    const { data: auth, isLoading: authLoading } = useCheckAuth();
    const { mutate: login, isPending: loginLoading, error: loginError, isSuccess: loginSuccess } = useLogin();
    const { mutate: register, isPending: registerLoading, error: registerError, isSuccess: registerSuccess } = useRegister();
    const { mutate: logout, isPending: logoutLoading, error: logoutError } = useLogout();

    useEffect(() => {
        const navigate = async () => {
            if (authLoading || hasNavigated) return;

            const currentPath = window.location.pathname;
            
            if (auth?.id) {
                // User is authenticated
                if (currentPath === '/login' || currentPath === '/register' || currentPath === '/') {
                    router.push('/home');
                    setHasNavigated(true);
                }
            } else {
                // User is not authenticated
                if (currentPath === '/home') {
                    const userName = getUserName();
                    if (userName) {
                        router.push(`/login?username=${encodeURIComponent(userName)}`);
                    } else {
                        router.push('/register');
                    }
                    setHasNavigated(true);
                } else if (currentPath === '/') {
                    const userName = getUserName();
                    if (userName) {
                        router.push(`/login?username=${encodeURIComponent(userName)}`);
                    } else {
                        router.push('/register');
                    }
                    setHasNavigated(true);
                }
            }
        };

        navigate();
    }, [auth, authLoading, router, hasNavigated]);

    // Reset navigation flag when auth state changes
    useEffect(() => {
        setHasNavigated(false);
    }, [auth?.id]);

    // Handle successful login/register
    useEffect(() => {
        if (loginSuccess || registerSuccess) {
            router.push('/home');
        }
    }, [loginSuccess, registerSuccess, router]);

    return (
        <AuthContext.Provider 
            value={{ 
                auth,
                authLoading,
                login,
                register,
                logout,
                loginLoading,
                registerLoading,
                logoutLoading,
                loginError,
                registerError,
                logoutError,
                loginSuccess,
                registerSuccess,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};