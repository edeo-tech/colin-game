import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import usersAuthApi from '@/_api/users/auth/users';
import { LoginUser, RegisterUser, LoginResponse, AuthenticatedUser } from '@/_interfaces/users/auth';
import { setAuthTokens, clearAuthTokens, setUserName, clearUserName, getAccessToken } from '@/utils/cookies';

export const useRegister = () => {
    const queryClient = useQueryClient();
    
    return useMutation<LoginResponse, Error, RegisterUser>({
        mutationFn: async (userData: RegisterUser) => {
            try {
                // First register the user
                await usersAuthApi.register(userData);
                
                // Then automatically login with the same credentials
                const loginResponse = await usersAuthApi.login({
                    email: userData.email,
                    password: userData.password
                });
                
                return loginResponse.data;
            } catch (error: unknown) {
                // Extract the error message from the backend response
                if (error && typeof error === 'object' && 'response' in error) {
                    const axiosError = error as { response?: { data?: { detail?: string }; status?: number } };
                    if (axiosError.response?.data?.detail) {
                        throw new Error(axiosError.response.data.detail);
                    } else if (axiosError.response?.status === 400) {
                        throw new Error('Registration failed. Please check your information.');
                    }
                }
                throw new Error('Registration failed. Please try again.');
            }
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
            try {
                const response = await usersAuthApi.login(credentials);
                return response.data;
            } catch (error: unknown) {
                // Extract the error message from the backend response
                if (error && typeof error === 'object' && 'response' in error) {
                    const axiosError = error as { response?: { data?: { detail?: string }; status?: number } };
                    if (axiosError.response?.data?.detail) {
                        throw new Error(axiosError.response.data.detail);
                    } else if (axiosError.response?.status === 401) {
                        throw new Error('Invalid email or password');
                    }
                }
                throw new Error('Login failed. Please try again.');
            }
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