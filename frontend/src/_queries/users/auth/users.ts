import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import usersAuthApi from '@/_api/users/auth/users';
import { LoginUser, RegisterUser, LoginResponse, AuthenticatedUser } from '@/_interfaces/users/auth';
import { setAuthTokens, clearAuthTokens, setUserName, clearUserName, getAccessToken } from '@/utils/cookies';

export const useRegister = () => {
    const queryClient = useQueryClient();
    
    return useMutation<LoginResponse, Error, RegisterUser>({
        mutationFn: async (userData: RegisterUser) => {
            const response = await usersAuthApi.register(userData);
            return response.data;
        },
        onSuccess: (data) => {
            setAuthTokens(data.tokens.access_token, data.tokens.refresh_token);
            setUserName(data.user.username);
            queryClient.setQueryData(['auth'], data.user);
        },
        onError: (error) => {
            console.error('Registration failed:', error);
        },
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    
    return useMutation<LoginResponse, Error, LoginUser>({
        mutationFn: async (credentials: LoginUser) => {
            const response = await usersAuthApi.login(credentials);
            return response.data;
        },
        onSuccess: (data) => {
            setAuthTokens(data.tokens.access_token, data.tokens.refresh_token);
            setUserName(data.user.username);
            queryClient.setQueryData(['auth'], data.user);
        },
        onError: (error) => {
            console.error('Login failed:', error);
        },
    });
};

export const useCheckAuth = () => {
    return useQuery<AuthenticatedUser, Error>({
        queryKey: ['auth'],
        queryFn: async () => {
            const token = getAccessToken();
            if (!token) {
                throw new Error('No token found');
            }
            const response = await usersAuthApi.checkAuth();
            return response.data;
        },
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    
    return useMutation<void, Error, void>({
        mutationFn: async () => {
            await usersAuthApi.logout();
        },
        onSuccess: () => {
            clearAuthTokens();
            clearUserName();
            queryClient.setQueryData(['auth'], null);
            queryClient.clear();
        },
        onError: (error) => {
            // Clear tokens even if logout fails
            clearAuthTokens();
            clearUserName();
            queryClient.setQueryData(['auth'], null);
            queryClient.clear();
            console.error('Logout failed:', error);
        },
    });
};