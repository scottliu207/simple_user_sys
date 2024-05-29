import { AuthLevel, UserStatus } from "../enum/user";
import { Paging } from "../utils/paging";

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