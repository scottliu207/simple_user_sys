import { NextFunction, Response } from "express";
import { } from "../utils/token";
import { resFormattor } from "../utils/res_formatter";
import { ErrDataNotFound, ErrInvalidUser, ErrNotAuthorized, ErrSomethingWentWrong } from "../err/error";
import { CustomRequest } from "../model/request";
import { GetUserOption } from "../model/sql_option";
import { getOneUser } from '../dao/sql/profile'
import { AuthLevel, UserStatus } from "../enum/user";
import { redisGet } from "../dao/cache/token";

/**
 * User authentication
 * @param req 
 * @param res 
 * @param next 
 */
export async function authenticator(req: CustomRequest, res: Response, next: NextFunction) {
    try {

        if (!req.accessToken) {
            res.json(resFormattor(ErrNotAuthorized))
            return
        }

        const userId = await redisGet(req.accessToken)
        if (!userId) {
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