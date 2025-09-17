import { UserRole } from './user-role';

export interface RegisterUser {
    username?: string;
    email: string;
    password: string;
    profile_picture?: string;
    expo_notification_token?: string;
    last_lat: number;
    last_long: number;
    device_os: string;
    school_id?: string;
}

export interface LoginUser {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: AuthenticatedUser;
    tokens: {
        access_token: string;
        refresh_token: string;
    };
}

export interface AuthenticatedUser {
    id: string;
    username: string;
    email: string;
    profile_picture?: string;
    xp_earned: number;
    profile_qrcode?: string;
    radius: number;
    is_banned: boolean;
    last_login?: string;
    school_id?: string;
    role: UserRole;
}