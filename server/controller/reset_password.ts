import { Request, Response, NextFunction } from 'express';
import { CustomRequest, LoginRequest, ResetPasswordReq } from '../model/request';
import { ErrDataNotFound, ErrInvalidPassword, ErrInvalidRequest, ErrInvalidUser, ErrNone, ErrNotAuthorized, ErrPasswordNotMatch, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { getOneUser, updateUser } from '../dao/sql/user'
import { genAccessToken, genRefreshToken } from '../utils/token';
import { hashPassword, verifyPassword } from '../utils/hash';
import { delAccessToken, setAccessToken } from '../dao/cache/access_token';
import { delRefreshToken, setRefreshToken } from '../dao/cache/refresh_token';
import { GetUserOption, UpdUserOption } from '../model/sql_option';
import { validatePassword } from '../utils/password_validator';
import { UserStatus } from '../enum/user';

/**
 * Handles user logout.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function resetPassword(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) {
            res.json(resFormattor(ErrNotAuthorized))
            return
        }

        if (req.user.status != UserStatus.ENABLE) {
            res.json(resFormattor(ErrInvalidUser))
            return
        }

        const { oldPassword, newPassword, newConfirmPassword } = req.body as ResetPasswordReq

        if (!oldPassword) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('oldPasword is required.')))
            return
        }

        if (!newPassword) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('newPassword is required.')))
            return
        }

        if (!newConfirmPassword) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('newConfirmPassword is required.')))
            return
        }

        const getOpt: GetUserOption = {
            userId: req.user.id,
        }

        const profile = await getOneUser(getOpt)
        if (!profile) {
            res.json(resFormattor(ErrDataNotFound.newMsg('Email or password is incorrect.')))
            return
        }

        const match = await verifyPassword(oldPassword, profile.passphrase)
        if (!match) {
            res.json(resFormattor(ErrDataNotFound.newMsg('Email or password is incorrect.')))
            return
        }

        if (!validatePassword(newPassword)) {
            res.json(resFormattor(ErrInvalidPassword.newMsg('Invalid password')))
            return
        }

        if (!validatePassword(newConfirmPassword)) {
            res.json(resFormattor(ErrInvalidPassword.newMsg('Invalid confirm password')))
            return
        }

        if (newPassword != newConfirmPassword) {
            res.json(resFormattor(ErrPasswordNotMatch))
            return
        }

        const hashedPassword = await hashPassword(newPassword)

        const updOpt: UpdUserOption = {
            passphrase: hashedPassword,
        }

        await updateUser(profile.id, updOpt)

        res.json(resFormattor(ErrNone))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};