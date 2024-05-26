import { UserStatus } from "../enum/user";

export interface GetUserOption {
    userId?: string;
    email?: string;
    username?: string;
    status?: UserStatus;
}

export interface UpdUserOption {
    username?: string;
    passphrase?: string;
    accountType?: string;
    status?: UserStatus;
}