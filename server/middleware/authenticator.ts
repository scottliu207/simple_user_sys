import { NextFunction, Response } from 'express';
import { resFormatter } from '../utils/res_formatter';
import { ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { CustomRequest } from '../model/request';
import { redisGet } from '../dao/cache/basic';

/**
 * User authentication middleware.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function authenticator(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.accessToken) {
            res.json(resFormatter(ErrNotAuthorized));
            return;
        }

        const userId = await redisGet(req.accessToken);
        if (!userId) {
            res.json(resFormatter(ErrNotAuthorized));
            return;
        }

        req.userId = userId;
    } catch (error: unknown) {
        console.log('Unknown error occurred: ' + error);
        res.json(resFormatter(ErrSomethingWentWrong));
        return;
    }

    next();
}
