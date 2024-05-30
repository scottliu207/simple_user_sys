import { NextFunction, Request, Response } from "express";
import { verifySessionId } from "../utils/token";
import { resFormattor } from "../utils/res_formatter";
import { ErrDataNotFound, ErrInvalidRequest, ErrInvalidUser, ErrNotAuthorized, ErrSomethingWentWrong } from "../err/error";
import { CustomRequest } from "../model/request";
import { GetUserOption } from "../model/sql_option";
import { getOneUser } from '../dao/sql/profile'
import { AuthLevel, UserStatus } from "../enum/user";
import { getRedisSession } from "../dao/cache/session";

/**
 * User authentication
 * @param req 
 * @param res 
 * @param next 
 */
export async function authenticator(req: CustomRequest, res: Response, next: NextFunction) {
    try {

        const sessionId: string = req.cookies[process.env.USER_SESSION_NAME!]
        if (!sessionId) {
            res.json(resFormattor(ErrNotAuthorized))
            return
        }

        const userId = verifySessionId(sessionId)

        const sessionIdCache = await getRedisSession(userId)
        if (!sessionIdCache) {
            res.json(resFormattor(ErrNotAuthorized))
            return
        }

        req.userId = userId

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
        return
    }

    next()
}

/**
 * User authentication
 * @param req 
 * @param res 
 * @param next 
 */
export async function isAdmin(req: CustomRequest, res: Response, next: NextFunction) {
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

        if (user.authLevel != AuthLevel.ADMIN) {
            res.json(resFormattor(ErrNotAuthorized.newMsg('Invalid user auth level.')))
            return
        }
    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
        return
    }

    next()
}