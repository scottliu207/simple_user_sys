import { Request, Response, NextFunction } from 'express';
import { CustomRequest, LoginRequest } from '../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrInvalidUser, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { } from '../dao/sql/user'
import { genAccessToken, genRefreshToken } from '../utils/token';
import { verifyPassword } from '../utils/hash';
import { delAccessToken, setAccessToken } from '../dao/cache/access_token';
import { delRefreshToken, setRefreshToken } from '../dao/cache/refresh_token';
import { GetUserOption } from '../model/sql_option';
import { UserStatus } from '../enum/user';

/**
 * Handles user logout.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function getUsers(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) {
            res.json(resFormattor(ErrNotAuthorized))
            return
        }
        
        if (req.user.status != UserStatus.ENABLE) {
            res.json(resFormattor(ErrInvalidUser))
            return
        }

        const result = {
            userId: req.user.id,
            username: req.user.username,
            email: req.user.email,
            accountType: req.user.accountType,
            createTime: req.user.createTime,
            updateTime: req.user.updateTime,
        }

        res.json(resFormattor(ErrNone, result))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};