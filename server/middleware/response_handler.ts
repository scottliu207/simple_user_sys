import { NextFunction, Request, Response } from 'express';
import { Res } from '../model/response';

/**
 * Middleware to handle and format the response.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export function responseHandler(req: Request, res: Response, next: NextFunction): void {
    const originalJson = res.json;
    res.json = function (data: Res): Response {
        res.json = originalJson;
        return res.status(data.httpCode).json({
            code: data.errorCode,
            message: data.message,
            result: data.result
        });
    };

    next();
}
