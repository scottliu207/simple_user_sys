import { Request, Response, NextFunction } from 'express';
import { CustomRequest, LoginRequest } from '../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import * as user from '../dao/sql/user'
import { genAccessToken, genRefreshToken } from '../utils/token';
import { verifyPassword } from '../utils/hash';
import { delAccessToken, setAccessToken } from '../dao/cache/access_token';
import { delRefreshToken, setRefreshToken } from '../dao/cache/refresh_token';
import { GetUserOption } from '../model/sql_option';

/**
 * Handles user logout.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function logout(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {

        if (!req.user) {
            res.json(resFormattor(ErrNotAuthorized))
            return
        }

        await delAccessToken(req.user.id)
        await delRefreshToken(req.user.id)

        res.json(resFormattor(ErrNone))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};