import { AccountType, UserStatus } from "../enum/user";

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
    page?: number;
    perPage?: number;
}

export interface UpdUserOption {
    username?: string;
    passphrase?: string;
    accountType?: AccountType;
    status?: UserStatus;
    lastSessionTime?: Date;
}

export interface GetLoginRecordsOption {
    userId?: string
    page?: number
    perPage?: number
}

export type GetUserSessionReportOption = {
    userId?: string;
    startTime: Date;
    endTime: Date;
}

export type GetUserSessionReportByDay = {
    startTime: Date;
    endTimme: Date;
}