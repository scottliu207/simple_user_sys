import { Response, NextFunction } from 'express';
import { CustomRequest, UpdateProfileReq } from '../model/request';
import { ErrDataNotFound, ErrInvalidUser, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { updateUser } from '../dao/sql/user'
import { genAccessToken, genRefreshToken } from '../utils/token';
import { verifyPassword } from '../utils/hash';
import { delAccessToken, setAccessToken } from '../dao/cache/access_token';
import { delRefreshToken, setRefreshToken } from '../dao/cache/refresh_token';
import { GetUserOption, UpdUserOption } from '../model/sql_option';
import { UserStatus } from '../enum/user';

/**
 * Handles user logout.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function updateProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {

        if (!req.user) {
            res.json(resFormattor(ErrNotAuthorized))
            return
        }

        if (req.user.status != UserStatus.ENABLE) {
            res.json(resFormattor(ErrInvalidUser))
            return
        }

        const { username } = req.body as UpdateProfileReq

        const updOpt: UpdUserOption = {
            username: username,
        }

        await updateUser(req.user.id, updOpt)

        res.json(resFormattor(ErrNone))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};