import { Response, NextFunction } from 'express';
import { CustomRequest } from '../model/request';
import { ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormatter } from '../utils/res_formatter';
import { getUserTokenKey, redisClearUserToken, redisGetUserToken } from '../dao/cache/user_token';
import { redisDel } from '../dao/cache/basic';
import { AccountType } from '../enum/user';
import { AuthStrategy } from '../auth/base';
import { AuthBasic } from '../auth/basic';
import { AuthGoogle } from '../auth/google';

/**
 * Handles user logout.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function logout(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) {
            res.json(resFormatter(ErrNotAuthorized));
            return;
        }

        let auth: AuthStrategy;
        switch (req.user.accountType) {
            case AccountType.EMAIL:
                auth = new AuthBasic();
                break;
            case AccountType.GOOGLE:
                auth = new AuthGoogle();
                break;
            default:
                res.json(resFormatter(ErrSomethingWentWrong.newMsg(`Unknown account type: ${req.user.accountType}`)));
                return;
        }

        const userToken = await redisGetUserToken(req.user.id);
        if (userToken) {
            await auth.revoke(userToken.accessToken);
            const key = getUserTokenKey(req.user.id);
            await redisDel(key);
            await redisClearUserToken(req.user.id, userToken);
        }

        res.json(resFormatter(ErrNone));
    } catch (error: unknown) {
        console.log('Unknown error occurred: ' + error);
        res.json(resFormatter(ErrSomethingWentWrong));
    }
}
