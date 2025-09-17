import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://edu-game-gen-backend.onrender.com';

export const axiosConfig = {
    unprotectedApi: axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    }),
};

export default axiosConfig;