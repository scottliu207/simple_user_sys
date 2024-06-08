import { Request, Response, NextFunction } from 'express';
import { SignInRequest } from '../model/request';
import { ErrDataNotFound, ErrInvalidAccountType, ErrInvalidRequest, ErrNone, ErrSomethingWentWrong } from '../err/error';
import { resFormatter } from '../utils/res_formatter';
import { getOneUser, updateUser } from '../dao/sql/profile';
import { verifyPassword } from '../utils/hash';
import { GetUserOption, UpdUserOption } from '../model/sql_option';
import { AccountType, UserStatus } from '../enum/user';
import { generateToken } from '../utils/token';
import { Token, redisGetUserToken, redisSetUserToken } from '../dao/cache/user_token';
import { createLoginRecord } from '../dao/sql/login_record';
import { redisSetUserActivity } from '../dao/cache/user_activity';
import { SignInResult } from '../model/response';

/**
 * Handles user sign-in.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body as SignInRequest;
        if (!email) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('Email is required.')));
            return;
        }

        if (!password) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('Password is required.')));
            return;
        }

        const getUserOpt: GetUserOption = {
            email: email,
        };

        const user = await getOneUser(getUserOpt);
        if (!user) {
            res.json(resFormatter(ErrDataNotFound.newMsg('Email or password is incorrect.')));
            return;
        }

        if (user.accountType !== AccountType.EMAIL) {
            res.json(resFormatter(ErrInvalidAccountType));
            return;
        }

        const match = await verifyPassword(password, user.passphrase!);
        if (!match) {
            res.json(resFormatter(ErrDataNotFound.newMsg('Email or password is incorrect.')));
            return;
        }

        const accessToken: Token = { token: generateToken(), expiresIn: process.env.ACCESS_TOKEN_EXPIRE! };
        const refreshToken: Token = { token: generateToken(), expiresIn: process.env.REFRESH_TOKEN_EXPIRE! };
        const userToken = await redisGetUserToken(user.id);

        await redisSetUserToken(user.id, userToken, accessToken, refreshToken);

        const updOpt: UpdUserOption = {
            lastSessionTime: new Date(),
        };

        await updateUser(user.id, updOpt);
        await createLoginRecord(user.id);
        if (user.status==UserStatus.ENABLE) {
            await redisSetUserActivity(user.id);
        }

        const result: SignInResult = {
            accessToken: accessToken.token,
            refreshToken: refreshToken.token,
        };

        res.json(resFormatter(ErrNone, result));
    } catch (error: unknown) {
        console.log('Unknown error occurred: ' + error);
        res.json(resFormatter(ErrSomethingWentWrong));
    }
}
