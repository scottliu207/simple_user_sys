import { Response, NextFunction } from 'express';
import { CustomRequest, ResetPasswordRequest } from '../model/request';
import { ErrDataNotFound, ErrInvalidAccountType, ErrInvalidPassword, ErrInvalidRequest, ErrInvalidUser, ErrNone, ErrNotAuthorized, ErrPasswordNotMatch, ErrSomethingWentWrong } from '../err/error';
import { resFormatter } from '../utils/res_formatter';
import { getOneUser, updateUser } from '../dao/sql/profile';
import { hashPassword, verifyPassword } from '../utils/hash';
import { GetUserOption, UpdUserOption } from '../model/sql_option';
import { validatePassword } from '../utils/password_validator';
import { AccountType, UserStatus } from '../enum/user';

/**
 * Handles password reset.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function resetPassword(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { oldPassword, newPassword, newConfirmPassword } = req.body as ResetPasswordRequest;

        if (!req.userId) {
            res.json(resFormatter(ErrNotAuthorized));
            return;
        }

        const getUserOpt: GetUserOption = {
            userId: req.userId,
        };

        const user = await getOneUser(getUserOpt);
        if (!user) {
            res.json(resFormatter(ErrDataNotFound.newMsg('User not found.')));
            return;
        }

        if (user.status !== UserStatus.ENABLE) {
            res.json(resFormatter(ErrInvalidUser));
            return;
        }

        if (user.accountType !== AccountType.EMAIL) {
            res.json(resFormatter(ErrInvalidAccountType));
            return;
        }

        if (!oldPassword) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('Old password is required.')));
            return;
        }

        if (!newPassword) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('New password is required.')));
            return;
        }

        if (!newConfirmPassword) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('Confirm password is required.')));
            return;
        }

        if (!validatePassword(newPassword)) {
            res.json(resFormatter(ErrInvalidPassword.newMsg('Invalid password.')));
            return;
        }

        if (!validatePassword(newConfirmPassword)) {
            res.json(resFormatter(ErrInvalidPassword.newMsg('Invalid confirm password.')));
            return;
        }

        if (newPassword !== newConfirmPassword) {
            res.json(resFormatter(ErrPasswordNotMatch));
            return;
        }

        const match = await verifyPassword(oldPassword, user.passphrase!);
        if (!match) {
            res.json(resFormatter(ErrDataNotFound.newMsg('Password is incorrect.')));
            return;
        }

        const hashedPassword = await hashPassword(newPassword);

        const updOpt: UpdUserOption = {
            passphrase: hashedPassword,
        };

        await updateUser(user.id, updOpt);

        res.json(resFormatter(ErrNone));
    } catch (error: unknown) {
        console.log('Unknown error occurred: ' + error);
        res.json(resFormatter(ErrSomethingWentWrong));
    }
}
