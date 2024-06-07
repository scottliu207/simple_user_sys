import { Response, NextFunction } from 'express';
import { CustomRequest } from '../model/request';
import { ErrSomethingWentWrong, ErrNone, ErrInvalidRequest, ErrDataNotFound, ErrMaxVerifyTryExceed, ErrNotAuthorized } from '../err/error';
import { resFormatter } from '../utils/res_formatter';
import { sendEmail } from '../utils/email';
import { generateJwtToken } from '../utils/token';
import { delEmailToken, getEmailToken, setEmailToken } from '../dao/cache/email_token';
import { GetUserOption } from '../model/sql_option';
import { getOneUser } from '../dao/sql/profile';
import { UserStatus } from '../enum/user';

/**
 * Handles resending verification email.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function resendEmail(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.userId) {
            res.json(resFormatter(ErrNotAuthorized));
            return;
        }

        const count = await getEmailToken(req.userId);
        const maxTry: number = process.env.EMAIL_MAX_TRY ? +process.env.EMAIL_MAX_TRY : 5;
        if (count > maxTry) {
            res.json(resFormatter(ErrMaxVerifyTryExceed));
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

        if (user.status !== UserStatus.UNVERIFIED) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('Invalid status for verifying email.')));
            return;
        }

        await delEmailToken(user.id);

        const emailToken = generateJwtToken(req.userId);
        await setEmailToken(req.userId);
        await sendEmail(user.email, user.username, emailToken);

        res.json(resFormatter(ErrNone));
    } catch (error: unknown) {
        console.log('Unknown error occurred: ' + error);
        res.json(resFormatter(ErrSomethingWentWrong));
    }
}
