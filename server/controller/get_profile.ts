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
export async function getProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {


        if (!req.userId) {
            res.json(resFormattor(ErrNotAuthorized))
            return
        }
        const option: GetUserOption = {
            userId: req.userId,
        }

        const profile = await user.get(option)
        if (!profile) {
            res.json(resFormattor(ErrDataNotFound.newMsg('User not found.')))
            return
        }

        const result = {
            userId: profile.id,
            username: profile.username,
            email: profile.email,
            accountType: profile.accountType,
            createTime: profile.createTime,
            updateTime: profile.updateTime,
        }

        res.json(resFormattor(ErrNone, result))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};