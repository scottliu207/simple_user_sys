import { Request } from "express";
import { UserProfile } from "./user_profile";

export interface CustomRequest extends Request {
    user?: UserProfile;
}

export interface SignUpRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UpdateProfileReq {
    username: string;
}

export interface ResetPasswordReq {
    oldPassword: string;
    newPassword: string;
    newConfirmPassword: string;
}

export interface RefreshTokenRequest {
    token: string;
}

export interface VerifyTokenRequest {
    token: string;
}

