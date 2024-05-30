import { Response, NextFunction } from 'express';
import { CustomRequest, } from '../model/request';
import { ErrDataNotFound, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { getUserTokenKey, redisClearUserToken, redisDel, redisGetUserToken } from '../dao/cache/token';
import { GetUserOption } from '../model/sql_option';
import { getOneUser } from '../dao/sql/profile';

/**
 * Handles user logout.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function logout(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {

        if (!req.userId) {
            res.json(resFormattor(ErrNotAuthorized))
            return
        }

        const getUserOpt: GetUserOption = {
            userId: req.userId,
        }

        const user = await getOneUser(getUserOpt)
        if (!user) {
            res.json(resFormattor(ErrDataNotFound.newMsg('User not found.')))
            return
        }

        const userToken = await redisGetUserToken(user.id)
        if (userToken) {
            const key = getUserTokenKey(user.id)
            await redisDel(key)
            await redisClearUserToken(user.id, userToken)
        }

        res.clearCookie(process.env.USER_SESSION_NAME!)
        res.json(resFormattor(ErrNone))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};