export interface RegisterUser {
    username: string;
    email: string;
    password: string;
    school_name?: string;
    profile_picture?: string;
    expo_notification_token?: string;
    last_lat: number;
    last_long: number;
    device_os: string;
}