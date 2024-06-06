import { Request, Response, NextFunction } from 'express';
import { ErrDataNotFound, ErrInvalidRequest, ErrInvalidToken, ErrInvalidUser, ErrNone, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { createUser, getOneUser } from '../dao/sql/profile'
import { verifyPassword } from '../utils/hash';
import { GetUserOption } from '../model/sql_option';
import { AccountType, UserStatus } from '../enum/user';
import { generateToken } from '../utils/token';
import { Token, redisGetUserToken, redisSetUserToken } from '../dao/cache/user_token';
import { createLoginRecord } from '../dao/sql/login_record';
import { getTokens, verify } from '../auth/google';
import { UserProfile } from '../model/user_profile';
import { genUuid } from '../utils/gen_uuid';

/**
 * Handles user login.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function googleAuthCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { code } = req.body
        if (!code) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('code is required.')))
            return
        }

        const token = await getTokens(code)
        if (!token) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('Invalid authCode')))
            return
        }

        const payload = await verify(token.id_token)
        if (!payload) {
            res.json(resFormattor(ErrInvalidToken))
            return
        }

        if (!payload.email) {
            res.json(resFormattor(ErrSomethingWentWrong.newMsg('Failed to retrieve the email from OAuth.')))
            return
        }

        const getUserOpt: GetUserOption = {
            email: payload.email,
        }

        let user = await getOneUser(getUserOpt)
        if (!user) {
            const userid = genUuid()

            const profile: UserProfile = {
                id: userid,
                username: payload.name ? payload.name : userid,
                accountType: AccountType.GOOGLE,
                status: UserStatus.ENABLE,
                email: payload.email,

            }

            await createUser(profile)
            user = profile
        }

        const accessToken: Token = { token: token.access_token, expriresIn: process.env.ACCESS_TOKEN_EXPIRE! }
        const refreshToken: Token = { token: token.refresh_token, expriresIn: process.env.REFRESH_TOKEN_EXPIRE! }
        let userToken = await redisGetUserToken(user.id)

        await redisSetUserToken(user.id, userToken, accessToken, refreshToken)
        userToken = {
            accessToken: accessToken.token,
            refreshToken: refreshToken.token,
        }


        console.log(userToken)
        await createLoginRecord(user.id)

        res.json(resFormattor(ErrNone, userToken))
    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};