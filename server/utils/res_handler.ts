
import { ErrorCode } from "../err/error";
import { BaseResult, Response } from "../model/response";
export function responseHandler(errorCode: ErrorCode, msg?: string, result?: BaseResult): Response {
    let res: Response = {
        errorCode: errorCode ? errorCode : 0,
        message: msg ? msg : "",
        result: result ? result : {}
    }
    return res

}