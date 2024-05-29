import { Request, Response, NextFunction } from 'express';
import { VerifyTokenRequest } from '../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrNone, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { getOneUser, updateUser } from '../dao/sql/user'
import { GetUserOption, UpdUserOption } from '../model/sql_option';
import { UserStatus } from '../enum/user'
import { verifyEmailToken } from '../utils/token';
import { delEmailToken, getEmailToken } from '../dao/cache/email_token';

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

        const userId = verifyEmailToken(token)

        const counts = await getEmailToken(userId)
        if (counts < 1) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('Invalid token.')))
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
        await delEmailToken(userId)

        res.json(resFormattor(ErrNone))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};