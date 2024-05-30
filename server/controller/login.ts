import { Request, Response, NextFunction, CookieOptions } from 'express';
import { LoginRequest } from '../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrNone, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { getOneUser } from '../dao/sql/profile'
import { verifyPassword } from '../utils/hash';
import { GetUserOption } from '../model/sql_option';
import { UserStatus } from '../enum/user';
import { generateSessionId } from '../utils/token';
import { delRedisSession, setRedisSession } from '../dao/cache/session';
import ms from 'ms';

/**
 * Handles user login.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body as LoginRequest
        if (!email) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('email is required.')))
            return
        }

        if (!password) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('password is required.')))
            return
        }

        const getUserOpt: GetUserOption = {
            email: email,
        }

        const existedUser = await getOneUser(getUserOpt)
        if (!existedUser) {
            res.json(resFormattor(ErrDataNotFound.newMsg('Email or password is incorrect.')))
            return
        }

        if (existedUser.status != UserStatus.ENABLE) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('Inavlid User.')))
            return
        }

        const match = await verifyPassword(password, existedUser.passphrase)
        if (!match) {
            res.json(resFormattor(ErrDataNotFound.newMsg('Email or password is incorrect.')))
            return
        }

        const sessionId = generateSessionId(existedUser.id)

        await delRedisSession(existedUser.id)
        await setRedisSession(existedUser.id, sessionId)

        const cookieOpt: CookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            maxAge: ms(process.env.USER_SESSION_EXPIRE!),
            sameSite: 'lax',
        }

        res.cookie(process.env.USER_SESSION_NAME!, sessionId, cookieOpt);

        res.json(resFormattor(ErrNone))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};