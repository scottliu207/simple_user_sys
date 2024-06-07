import { Request } from 'express';
import { UserStatus } from '../enum/user';

export interface CustomRequest extends Request {
    accessToken?: string;
    userId?: string;
}

export type SignUpRequest = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type SignInRequest = {
    email: string;
    password: string;
};

export type UpdateProfileRequest = {
    username: string;
};

export type ResetPasswordRequest = {
    oldPassword: string;
    newPassword: string;
    newConfirmPassword: string;
};

export type RefreshTokenRequest = {
    token: string;
};

export type VerifyTokenRequest = {
    token: string;
};

export type ResendEmailRequest = {
    token: string;
};

export type GetUsersRequest = {
    userId?: string;
    username?: string;
    email?: string;
    status?: UserStatus;
    page: number;
    perPage: number;
};
