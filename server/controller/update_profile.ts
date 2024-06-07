import { Response, NextFunction } from 'express';
import { CustomRequest, UpdateProfileRequest } from '../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrInvalidUser, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormatter } from '../utils/res_formatter';
import { getOneUser, updateUser } from '../dao/sql/profile';
import { UserStatus } from '../enum/user';
import { GetUserOption, UpdUserOption } from '../model/sql_option';

/**
 * Handles profile update.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function updateProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { username } = req.body as UpdateProfileRequest;

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

        if (!username) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('Username is required.')));
            return;
        }

        const updOpt: UpdUserOption = {
            username: username,
        };

        await updateUser(user.id, updOpt);

        res.json(resFormatter(ErrNone));
    } catch (error: unknown) {
        console.log('Unknown error occurred: ' + error);
        res.json(resFormatter(ErrSomethingWentWrong));
    }
}
