import { Response, NextFunction } from 'express';
import { CustomRequest, ResendEmailRequest } from '../model/request';
import { ErrSomethingWentWrong, ErrNone, ErrInvalidRequest, ErrDataNotFound, ErrMaxVerifyTryExceed, ErrNotAuthorized } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { sendEmail } from '../utils/email';
import { generateJwtToken, verifyJwtToken } from '../utils/token';
import { delEmailToken, getEmailToken, setEmailToken } from '../dao/cache/email_token';
import { GetUserOption } from '../model/sql_option';
import { getOneUser } from '../dao/sql/profile';
import { UserStatus } from '../enum/user';

/**
 * Handles user sign-up.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function resendEmail(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {

    try {
        if (!req.userId) {
            res.json(resFormattor(ErrNotAuthorized))
            return
        }

        const count = await getEmailToken(req.userId)
        const maxTry: number = process.env.EMAIL_MAX_TRY ? +process.env.EMAIL_MAX_TRY : 5
        if (count > maxTry) {
            res.json(resFormattor(ErrMaxVerifyTryExceed))
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

        if (user.status != UserStatus.UNVERIFIED) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('Invalid status for verifying email.')))
            return
        }

        await delEmailToken(user.id)

        const emailToken = generateJwtToken(req.userId)
        const _ = await setEmailToken(req.userId)
        await sendEmail(user.email, user.username, emailToken)

        res.json(resFormattor(ErrNone))
        return
    } catch (error: unknown) {
        console.log('Unkonwn error occured, ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
        return
    }
};