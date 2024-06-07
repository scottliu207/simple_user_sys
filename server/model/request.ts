import { Request } from "express";
import { AccountType, UserStatus } from "../enum/user";

export interface CustomRequest extends Request {
    accessToken?: string;
    userId?: string;
}

export interface SignUpRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface UpdateProfileRequest {
    username: string;
}

export interface ResetPasswordRequest {
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

export interface RefreshTokenRequest {
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
