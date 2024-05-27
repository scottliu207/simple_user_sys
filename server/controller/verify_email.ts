import { Request, Response, NextFunction } from 'express';
import { LoginRequest, VerifyTokenRequest } from '../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { getOneUser, updateUser } from '../dao/sql/user'
import { genAccessToken, genRefreshToken, validateEmailToken } from '../utils/token';
import { verifyPassword } from '../utils/hash';
import { delAccessToken, setAccessToken } from '../dao/cache/access_token';
import { delRefreshToken, setRefreshToken } from '../dao/cache/refresh_token';
import { GetUserOption, UpdUserOption } from '../model/sql_option';
import { delVerifyToken, getVerifyToken } from '../dao/cache/verify_token';
import { UserStatus } from '../enum/user'

/**
 * Handles user login.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { token } = req.body as VerifyTokenRequest
        if (!token) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('token is required.')))
            return
        }

        const userId = await validateEmailToken(token)
        const vtCache = await getVerifyToken(userId)

        if (token != vtCache) {
            res.json(resFormattor(ErrNotAuthorized.newMsg('Wrong verification token.')))
            return
        }

        const getUserOpt: GetUserOption = {
            userId: userId,
        }

        const existedUser = await getOneUser(getUserOpt)
        if (!existedUser) {
            res.json(resFormattor(ErrDataNotFound.newMsg('User not found.')))
            return
        }

        if (existedUser.status == UserStatus.ENABLE) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('User has been verified.')))
            return
        }

        if (existedUser.status == UserStatus.DISABLE) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('User has been suspended.')))
            return
        }

        const UpdateOpt: UpdUserOption = {
            status: UserStatus.ENABLE
        }

        await updateUser(userId, UpdateOpt)
        await delVerifyToken(userId)

        res.json(resFormattor(ErrNone))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};