import { Request, Response, NextFunction } from 'express';
import { CustomRequest, VerifyTokenRequest } from '../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrInvalidToken, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormatter } from '../utils/res_formatter';
import { getOneUser, updateUser } from '../dao/sql/profile';
import { GetUserOption, UpdUserOption } from '../model/sql_option';
import { UserStatus } from '../enum/user';
import { verifyJwtToken } from '../utils/token';
import { delEmailToken, getEmailToken } from '../dao/cache/email_token';

/**
 * Handles email verification.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function verifyEmail(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { token } = req.body as VerifyTokenRequest;

        if (!req.userId) {
            res.json(resFormatter(ErrNotAuthorized));
            return;
        }

        if (!token) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('Token is required.')));
            return;
        }

        const userId = verifyJwtToken(token);
        if (!userId) {
            res.json(resFormatter(ErrInvalidToken));
            return;
        }

        if (userId !== req.userId) {
            res.json(resFormatter(ErrInvalidToken));
            return;
        }

        const counts = await getEmailToken(userId);
        if (counts < 1) {
            res.json(resFormatter(ErrInvalidRequest));
            return;
        }
        const getUserOpt: GetUserOption = {
            userId: userId,
        };

        const existedUser = await getOneUser(getUserOpt);
        if (!existedUser) {
            res.json(resFormatter(ErrDataNotFound.newMsg('User not found.')));
            return;
        }

        if (existedUser.status === UserStatus.ENABLE) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('User has been verified.')));
            return;
        }

        if (existedUser.status === UserStatus.DISABLE) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('User has been suspended.')));
            return;
        }

        const updateOpt: UpdUserOption = {
            status: UserStatus.ENABLE,
        };

        await updateUser(userId, updateOpt);
        await delEmailToken(userId);

        res.json(resFormatter(ErrNone));
    } catch (error: unknown) {
        console.log('Unknown error occurred: ' + error);
        res.json(resFormatter(ErrSomethingWentWrong));
    }
}
