
import { CustomError } from "../err/error";
import { BaseResult, Res } from "../model/response";


/**
 * Formatting response
 * @param err 
 * @param result 
 * @returns {Res} - Response object
 */
export function resFormattor(err: CustomError, result?: BaseResult): Res {
    let res: Res = {
        httpCode: err.httpCode,
        errorCode: err.errorCode,
        message: err.message,
        result: result ? result : {}
    }
    return res
}