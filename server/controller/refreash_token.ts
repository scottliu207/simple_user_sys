import { Response, NextFunction } from 'express';
import { CustomRequest, RefreshTokenRequest } from '../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrInvalidToken, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormatter } from '../utils/res_formatter';
import { GetUserOption } from '../model/sql_option';
import { AccountType, UserStatus } from '../enum/user';
import { redisGetUserToken, redisUpdateAccessToken } from '../dao/cache/user_token';
import { getOneUser } from '../dao/sql/profile';
import { redisDel, redisGet, redisSet } from '../dao/cache/basic';
import { AuthGoogle } from '../auth/google';
import { AuthBasic } from '../auth/basic';
import { AuthStrategy } from '../auth/base';
import { redisSetUserActivity } from '../dao/cache/user_activity';

/**
 * Handles token refresh.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function refreshToken(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { token } = req.body as RefreshTokenRequest;
        if (!token) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('Token is required.')));
            return;
        }

        const userId = await redisGet(token);
        if (!userId) {
            res.json(resFormatter(ErrInvalidToken));
            return;
        }

        const getUserOpt: GetUserOption = {
            userId: userId,
        };

        const user = await getOneUser(getUserOpt);
        if (!user) {
            res.json(resFormatter(ErrDataNotFound.newMsg('User not found.')));
            return;
        }

        if (user.status !== UserStatus.ENABLE) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('Invalid User.')));
            return;
        }

        const userToken = await redisGetUserToken(user.id);
        if (!userToken) {
            res.json(resFormatter(ErrNotAuthorized.newMsg('Token expired.')));
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

        const newAccessToken = await auth.refreshToken(token);
        if (!newAccessToken) {
            res.json(resFormatter(ErrNotAuthorized.newMsg('Token expired.')));
            return;
        }

        await redisDel(userToken.accessToken);
        await redisUpdateAccessToken(user.id, newAccessToken);
        await redisSet(newAccessToken, user.id, process.env.ACCESS_TOKEN_EXPIRE!);

        const result = {
            accessToken: newAccessToken,
        };

        await redisSetUserActivity(user.id);
        res.json(resFormatter(ErrNone, result));
    } catch (error: unknown) {
        console.log('Unknown error occurred: ' + error);
        res.json(resFormatter(ErrSomethingWentWrong));
    }
}
