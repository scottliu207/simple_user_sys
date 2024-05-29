import { AccountType, UserStatus } from "../enum/user";
import { ErrorCode } from "../err/error";

export interface Res {
    httpCode: number;
    errorCode: ErrorCode;
    message: string;
    result: BaseResult;
}

export interface BaseResult { }

export interface SignUpResult extends BaseResult {
    userId: string
}

export interface GetUserResult extends BaseResult {
    userId: string;
    email: string;
    username: string;
    accountType: AccountType;
}

export interface GetUsersResultRow extends BaseResult {
    userId: string;
    username: string;
    email: string;
    status: UserStatus;
    accountType: AccountType;
    createTime: Date;
    updateTime: Date;
}

export interface GetUsersResult extends BaseResult {
    data: GetUsersResultRow[];
    total: number;
}