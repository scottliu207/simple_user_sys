import { NextFunction, Response } from 'express';
import { resFormatter } from '../utils/res_formatter';
import { ErrDataNotFound, ErrInvalidUser, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { CustomRequest } from '../model/request';
import { getOneUser } from '../dao/sql/profile';
import { GetUserOption } from '../model/sql_option';
import { UserStatus } from '../enum/user';

/**
 * User status validation middleware.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function userStatusValidation(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
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

        req.user = user
    } catch (error: unknown) {
        console.log('Unknown error occurred: ' + error);
        res.json(resFormatter(ErrSomethingWentWrong));
        return;
    }

    next();
}
