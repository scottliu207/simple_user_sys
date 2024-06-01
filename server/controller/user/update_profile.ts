import { Response, NextFunction } from 'express';
import { CustomRequest, UpdateProfileReq } from '../../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrInvalidUser, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../../err/error';
import { resFormattor } from '../../utils/res_formatter';
import { getOneUser, updateUser } from '../../dao/sql/profile'
import { UserStatus } from '../../enum/user';
import { GetUserOption, UpdUserOption } from '../../model/sql_option';

/**
 * Handles user logout.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function updateProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
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

        const { username } = req.body as UpdateProfileReq

        if (!username) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('username is required.')))
            return
        }

        const updOpt: UpdUserOption = {
            username: username,
        }

        await updateUser(user.id, updOpt)

        res.json(resFormattor(ErrNone))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};