import { NextFunction, Request, Response } from "express";
import { validateAccessToken } from "../utils/token";
import { resFormattor } from "../utils/res_formatter";
import { ErrNotAuthorized, ErrSomethingWentWrong } from "../err/error";
import { CustomRequest } from "../model/request";
import { getAccessToken } from "../dao/cache/access_token";

/**
 * User authentication
 * @param req 
 * @param res 
 * @param next 
 */
export async function Authenticator(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        const token = req.headers['api-token'] as string;
        if (!token) {
            res.json(resFormattor(ErrNotAuthorized))
            return
        }
        
        const payload = await validateAccessToken(token)
        const value = await getAccessToken(payload.userId)
        if (!value) {
            res.json(resFormattor(ErrNotAuthorized))
            return
        }

        req.userId = payload.userId
    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
        return
    }

    next()
}