import Cookies from 'js-cookie';

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
    Cookies.set('access_token', accessToken, { expires: 7, secure: true, sameSite: 'strict' });
    Cookies.set('refresh_token', refreshToken, { expires: 30, secure: true, sameSite: 'strict' });
};

export const getAccessToken = () => {
    return Cookies.get('access_token');
};

export const getRefreshToken = () => {
    return Cookies.get('refresh_token');
};

export const clearAuthTokens = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
};

export const setUserName = (username: string) => {
    localStorage.setItem('user_name', username);
};

export const getUserName = () => {
    return localStorage.getItem('user_name');
};

export const clearUserName = () => {
    localStorage.removeItem('user_name');
};