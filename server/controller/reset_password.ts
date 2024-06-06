import { Response, NextFunction } from 'express';
import { CustomRequest, ResetPasswordReq } from '../model/request';
import { ErrDataNotFound, ErrInvalidAccountType, ErrInvalidPassword, ErrInvalidRequest, ErrInvalidUser, ErrNone, ErrNotAuthorized, ErrPasswordNotMatch, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { getOneUser, updateUser } from '../dao/sql/profile'
import { hashPassword, verifyPassword } from '../utils/hash';
import { GetUserOption, UpdUserOption } from '../model/sql_option';
import { validatePassword } from '../utils/password_validator';
import { AccountType, UserStatus } from '../enum/user';

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

        const getUserOpt: GetUserOption = {
            userId: req.userId,
        }

        const user = await getOneUser(getUserOpt)
        if (!user) {
            res.json(resFormattor(ErrDataNotFound.newMsg('User not found.')))
            return
        }

        if (user.status != UserStatus.ENABLE) {
            res.json(resFormattor(ErrInvalidUser))
            return
        }

        if (user.accountType != AccountType.EMAIL) {
            res.json(resFormattor(ErrInvalidAccountType))
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

        const match = await verifyPassword(oldPassword, user.passphrase!)
        if (!match) {
            res.json(resFormattor(ErrDataNotFound.newMsg('password is incorrect.')))
            return
        }

        const hashedPassword = await hashPassword(newPassword)

        const updOpt: UpdUserOption = {
            passphrase: hashedPassword,
        }

        await updateUser(user.id, updOpt)

        res.json(resFormattor(ErrNone))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};