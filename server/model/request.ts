import { Request } from "express";
import { UserProfile } from "./user_profile";
import { UserStatus } from "../enum/user";

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


export interface ResendEmailRequest {
    token: string;
}

export interface GetUsersRequest {
    userId?: string;
    username?: string;
    email?: string;
    status?: UserStatus;
    page: number;
    perPage: number;
}
