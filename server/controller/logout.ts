import { Response, NextFunction } from 'express';
import { CustomRequest } from '../model/request';
import { ErrDataNotFound, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormatter } from '../utils/res_formatter';
import { getUserTokenKey, redisClearUserToken, redisGetUserToken } from '../dao/cache/user_token';
import { GetUserOption } from '../model/sql_option';
import { getOneUser } from '../dao/sql/profile';
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
        if (!req.userId) {
            res.json(resFormatter(ErrNotAuthorized));
            return;
        }

        const getUserOpt: GetUserOption = {
            userId: req.userId,
        };

        const user = await getOneUser(getUserOpt);
        if (!user) {
            res.json(resFormatter(ErrDataNotFound.newMsg('User not found.')));
            return;
        }

        let auth: AuthStrategy;
        switch (user.accountType) {
            case AccountType.EMAIL:
                auth = new AuthBasic();
                break;
            case AccountType.GOOGLE:
                auth = new AuthGoogle();
                break;
            default:
                res.json(resFormatter(ErrSomethingWentWrong.newMsg(`Unknown account type: ${user.accountType}`)));
                return;
        }

        const userToken = await redisGetUserToken(user.id);
        if (userToken) {
            await auth.revoke(userToken.accessToken);
            const key = getUserTokenKey(user.id);
            await redisDel(key);
            await redisClearUserToken(user.id, userToken);
        }

        res.clearCookie(process.env.USER_SESSION_NAME!);
        res.json(resFormatter(ErrNone));
    } catch (error: unknown) {
        console.log('Unknown error occurred: ' + error);
        res.json(resFormatter(ErrSomethingWentWrong));
    }
}
