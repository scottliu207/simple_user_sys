import { Request, Response, NextFunction } from 'express';
import { RefreshTokenRequest } from '../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { getOneUser } from '../dao/sql/user'
import { genAccessToken, validateRefreshToken } from '../utils/token';
import { setAccessToken } from '../dao/cache/access_token';
import { getRefreshToken } from '../dao/cache/refresh_token';
import { GetUserOption } from '../model/sql_option';

/**
 * Refresh user's access token.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { token } = req.body as RefreshTokenRequest
        if (!token) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('Token is required.')))
            return
        }
        
        const payload = await validateRefreshToken(token)
        const cacheRT = await getRefreshToken(payload.userId)
        if (token != cacheRT) {
            res.json(resFormattor(ErrNotAuthorized.newMsg('Invalid token.')))
            return
        }

        const accessToken = await genAccessToken(payload.userId)

        const getUserOpt: GetUserOption = {
            userId: payload.userId,
        }
        const profile = await getOneUser(getUserOpt)
        if (!profile) {
            res.json(resFormattor(ErrDataNotFound))
            return
        }

        await setAccessToken(profile)

        res.json(resFormattor(ErrNone, { accessToken: accessToken }))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};