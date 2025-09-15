import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const axiosConfig = {
    unprotectedApi: axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    }),
    protectedApi: axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    }),
};

axiosConfig.protectedApi.interceptors.request.use(
    (config) => {
        const token = Cookies.get('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosConfig.protectedApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            localStorage.removeItem('user_name');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosConfig;