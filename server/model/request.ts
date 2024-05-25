import { Request } from "express";

export interface CustomRequest extends Request {
    userId?: string;
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
    password: string;
    confirmPassword: string;
}

export interface RefreshTokenRequest {
    token: string;
}

