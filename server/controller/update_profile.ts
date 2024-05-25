import { Response, NextFunction } from 'express';
import { CustomRequest, UpdateProfileReq } from '../model/request';
import { ErrDataNotFound, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import * as user from '../dao/sql/user'
import { genAccessToken, genRefreshToken } from '../utils/token';
import { verifyPassword } from '../utils/hash';
import { delAccessToken, setAccessToken } from '../dao/cache/access_token';
import { delRefreshToken, setRefreshToken } from '../dao/cache/refresh_token';
import { GetUserOption, UpdUserOption } from '../model/sql_option';

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

        const { username } = req.body as UpdateProfileReq
        const getOpt: GetUserOption = {
            userId: req.userId,
        }

        const profile = await user.get(getOpt)
        if (!profile) {
            res.json(resFormattor(ErrDataNotFound.newMsg('User not found.')))
            return
        }

        const updOpt: UpdUserOption = {
            username: username,
        }

        await user.update(profile.id, updOpt)

        res.json(resFormattor(ErrNone))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};