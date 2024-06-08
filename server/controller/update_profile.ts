import { Response, NextFunction } from 'express';
import { CustomRequest, UpdateProfileRequest } from '../model/request';
import { ErrInvalidRequest, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormatter } from '../utils/res_formatter';
import { updateUser } from '../dao/sql/profile';
import { UpdUserOption } from '../model/sql_option';

/**
 * Handles profile update.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function updateProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { username } = req.body as UpdateProfileRequest;

        if (!req.user) {
            res.json(resFormatter(ErrNotAuthorized));
            return;
        }

        if (!username) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('Username is required.')));
            return;
        }

        const updOpt: UpdUserOption = {
            username: username,
        };

        await updateUser(req.user.id, updOpt);

        res.json(resFormatter(ErrNone));
    } catch (error: unknown) {
        console.log('Unknown error occurred: ' + error);
        res.json(resFormatter(ErrSomethingWentWrong));
    }
}
