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