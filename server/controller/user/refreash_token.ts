import { Response, NextFunction } from 'express';
import { CustomRequest } from '../../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrInvalidToken, ErrNone, ErrSomethingWentWrong } from '../../err/error';
import { resFormattor } from '../../utils/res_formatter';
import { GetUserOption } from '../../model/sql_option';
import { UserStatus } from '../../enum/user';
import { generateToken } from '../../utils/token';
import { redisGetUserToken, redisUpdateAccessToken } from '../../dao/cache/user_token';
import { getOneUser } from '../../dao/sql/profile';
import { redisDel, redisGet, redisSet } from '../../dao/cache/basic';

/**
 * Handles user login.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function refreshToken(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { token } = req.body
        if (!token) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('token is required.')))
            return
        }

        const userId = await redisGet(token)
        if (!userId) {
            res.json(resFormattor(ErrInvalidToken))
            return
        }

        const getUserOpt: GetUserOption = {
            userId: userId,
        }

        const user = await getOneUser(getUserOpt)
        if (!user) {
            res.json(resFormattor(ErrDataNotFound.newMsg('User not found.')))
            return
        }

        if (user.status != UserStatus.ENABLE) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('Inavlid User.')))
            return
        }

        const userToken = await redisGetUserToken(user.id)
        if (!userToken) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('token is required.')))
            return
        }

        const newAccessToken = generateToken()
        await redisDel(userToken.accessToken)
        await redisUpdateAccessToken(user.id, newAccessToken)
        await redisSet(newAccessToken, user.id, process.env.ACCESS_TOKEN_EXPIRE!)

        const result = {
            'accessToken': newAccessToken,
        }

        res.json(resFormattor(ErrNone, result))
    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};