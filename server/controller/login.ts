import { Request, Response, NextFunction } from 'express';
import { LoginRequest } from '../model/request';
import { ErrDataNotFound, ErrInvalidAccountType, ErrInvalidRequest, ErrNone, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { getOneUser } from '../dao/sql/profile'
import { verifyPassword } from '../utils/hash';
import { GetUserOption } from '../model/sql_option';
import { AccountType, UserStatus } from '../enum/user';
import { generateToken } from '../utils/token';
import { Token, redisGetUserToken, redisSetUserToken } from '../dao/cache/user_token';
import { createLoginRecord } from '../dao/sql/login_record';

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

        const user = await getOneUser(getUserOpt)
        if (!user) {
            res.json(resFormattor(ErrDataNotFound.newMsg('Email or password is incorrect.')))
            return
        }

        if (user.accountType != AccountType.EMAIL) {
            res.json(resFormattor(ErrInvalidAccountType))
            return
        }

        const match = await verifyPassword(password, user.passphrase!)
        if (!match) {
            res.json(resFormattor(ErrDataNotFound.newMsg('Email or password is incorrect.')))
            return
        }

        const accessToken: Token = { token: generateToken(), expriresIn: process.env.ACCESS_TOKEN_EXPIRE! }
        const refreshToken: Token = { token: generateToken(), expriresIn: process.env.REFRESH_TOKEN_EXPIRE! }
        let userToken = await redisGetUserToken(user.id)

        await redisSetUserToken(user.id, userToken, accessToken, refreshToken)
        userToken = {
            accessToken: accessToken.token,
            refreshToken: refreshToken.token,
        }

        await createLoginRecord(user.id)

        res.json(resFormattor(ErrNone, userToken))
    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};