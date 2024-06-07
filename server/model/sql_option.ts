import { AccountType, UserStatus } from '../enum/user';

export type GetUserOption = {
    userId?: string;
    email?: string;
    username?: string;
    status?: UserStatus;
    page?: number;
    perPage?: number;
}

export type GetUsersOption = {
    userId?: string;
    email?: string;
    username?: string;
    status?: UserStatus;
    page?: number;
    perPage?: number;
}

export type UpdUserOption = {
    username?: string;
    passphrase?: string;
    accountType?: AccountType;
    status?: UserStatus;
    lastSessionTime?: Date;
}

export type GetLoginRecordsOption = {
    userId?: string;
    page?: number;
    perPage?: number;
}

export type GetUserSessionReportOption = {
    userId?: string;
    startTime: Date;
    endTime: Date;
}
