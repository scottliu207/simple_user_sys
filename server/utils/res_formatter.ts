import { CustomError } from '../err/error';
import { BaseResult, Res } from '../model/response';

/**
 * Formats a response.
 * @param err - The error object.
 * @param result - The result object (optional).
 * @returns {Res} - The formatted response object.
 */
export function resFormatter(err: CustomError, result?: BaseResult): Res {
    const res: Res = {
        httpCode: err.httpCode,
        errorCode: err.errorCode,
        message: err.message,
        result: result ? result : {},
    };
    return res;
}
