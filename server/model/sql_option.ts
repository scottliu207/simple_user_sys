import { AuthLevel, UserStatus } from "../enum/user";

export interface GetUserOption {
    userId?: string;
    email?: string;
    username?: string;
    status?: UserStatus;
    page?: number;
    perPage?: number;
}

export interface GetUsersOption {
    userId?: string;
    email?: string;
    username?: string;
    status?: UserStatus;
    authLevel?: AuthLevel;
    page: number;
    perPage: number;
}

export interface UpdUserOption {
    username?: string;
    passphrase?: string;
    accountType?: string;
    status?: UserStatus;
}

export interface GetLoginRecordsOption {
    userId?: string
    page?: number
    perPage?: number
}