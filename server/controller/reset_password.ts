import { Request, Response, NextFunction } from 'express';
import { CustomRequest, LoginRequest, ResetPasswordReq } from '../model/request';
import { ErrDataNotFound, ErrInvalidPassword, ErrInvalidRequest, ErrNone, ErrNotAuthorized, ErrPasswordNotMatch, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import * as user from '../dao/sql/user'
import { genAccessToken, genRefreshToken } from '../utils/token';
import { hashPassword, verifyPassword } from '../utils/hash';
import { delAccessToken, setAccessToken } from '../dao/cache/access_token';
import { delRefreshToken, setRefreshToken } from '../dao/cache/refresh_token';
import { GetUserOption, UpdUserOption } from '../model/sql_option';
import { validatePassword } from '../utils/password_validator';

/**
 * Handles user logout.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function resetPassword(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.userId) {
            res.json(resFormattor(ErrNotAuthorized))
            return
        }

        const { password, confirmPassword } = req.body as ResetPasswordReq

        if (!password) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('password is required.')))
            return
        }

        if (!confirmPassword) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('confirmPassword is required.')))
            return
        }

        if (!validatePassword(password)) {
            res.json(resFormattor(ErrInvalidPassword.newMsg('Invalid password')))
            return
        }

        if (!validatePassword(confirmPassword)) {
            res.json(resFormattor(ErrInvalidPassword.newMsg('Invalid confirm password')))
            return
        }

        if (password != confirmPassword) {
            res.json(resFormattor(ErrPasswordNotMatch))
            return
        }

        const getOpt: GetUserOption = {
            userId: req.userId,
        }

        const profile = await user.get(getOpt)
        if (!profile) {
            res.json(resFormattor(ErrDataNotFound.newMsg('User not found.')))
            return
        }


        const hashedPassword = await hashPassword(password)

        const updOpt: UpdUserOption = {
            passphrase: hashedPassword,
        }

        await user.update(profile.id, updOpt)

        res.json(resFormattor(ErrNone))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};