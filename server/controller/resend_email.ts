import { Response, NextFunction } from 'express';
import { CustomRequest, ResendEmailRequest } from '../model/request';
import { ErrSomethingWentWrong, ErrNone, ErrInvalidRequest, ErrDataAlreadyExists, ErrDataNotFound, ErrMaxVerifyTryExceed } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { sendEmail } from '../utils/email';
import { genEmailToken, verifyEmailToken } from '../utils/token';
import { delEmailToken, getEmailToken, setEmailToken } from '../dao/cache/email_token';
import { GetUserOption } from '../model/sql_option';
import { getOneUser } from '../dao/sql/user';
import { UserStatus } from '../enum/user';

/**
 * Handles user sign-up.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function resendEmail(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {

    try {
        const { token } = req.body as ResendEmailRequest
        if (!token) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('token is required.')))
            return
        }

        const userId = verifyEmailToken(token)
        const count = await getEmailToken(userId)
        if (count<1) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('Invalid token.')))
            return
        }

        const maxTry:number = process.env.EMAIL_MAX_TRY? +process.env.EMAIL_MAX_TRY:5
        if (count>maxTry){
            res.json(resFormattor(ErrMaxVerifyTryExceed))
            return 
        }

        const getUserOpt: GetUserOption = {
            userId: userId,
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

        const emailToken = genEmailToken(userId)
        const _ = await setEmailToken(userId, emailToken)
        await sendEmail(user.email, user.username, emailToken)

        res.json(resFormattor(ErrNone))
        return
    } catch (error: unknown) {
        console.log('Unkonwn error occured, ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
        return
    }
};