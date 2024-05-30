import { Response, NextFunction } from 'express';
import { CustomRequest, } from '../model/request';
import { ErrDataNotFound, ErrInvalidUser, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { UserStatus } from '../enum/user';
import { GetUserOption } from '../model/sql_option';
import { getOneUser } from '../dao/sql/profile';
import { GetUserResult } from '../model/response';

/**
 * Handles user logout.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function getProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
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

        let result: GetUserResult = {
            userId:user.id,
            username:user.username,
            email:user.email,
            accountType:user.accountType,
        }

        res.json(resFormattor(ErrNone, result))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};