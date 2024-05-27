import { Request, Response, NextFunction } from 'express';
import { LoginRequest } from '../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrNone, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { getOneUser } from '../dao/sql/user'
import { genAccessToken, genRefreshToken } from '../utils/token';
import { verifyPassword } from '../utils/hash';
import { delAccessToken, setAccessToken } from '../dao/cache/access_token';
import { delRefreshToken, setRefreshToken } from '../dao/cache/refresh_token';
import { GetUserOption } from '../model/sql_option';
import { UserStatus } from '../enum/user';

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

        await delAccessToken(existedUser.id)
        await delRefreshToken(existedUser.id)

        const accessToken = await genAccessToken(existedUser.id)
        const refreshToken = await genRefreshToken(existedUser.id)

        await setAccessToken(existedUser)
        await setRefreshToken(refreshToken.userId, refreshToken.token)

        res.json(resFormattor(ErrNone, { accessToken: accessToken, refreshToken: refreshToken.token }))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};