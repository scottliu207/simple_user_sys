import { ErrorCode } from "../err/error";

export interface Response {
    errorCode: ErrorCode;
    message: string;
    result: BaseResult;
}

export interface BaseResult { }

export interface SignUpResult extends BaseResult {
    userId: string
}