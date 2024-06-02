import { NextFunction, Response } from "express";
import { resFormattor } from "../utils/res_formatter";
import { ErrDataNotFound, ErrInvalidUser, ErrNotAuthorized, ErrSomethingWentWrong } from "../err/error";
import { CustomRequest } from "../model/request";
import { UserStatus } from "../enum/user";
import { redisGet } from "../dao/cache/basic";

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