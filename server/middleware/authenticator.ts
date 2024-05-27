import { NextFunction, Request, Response } from "express";
import { validateAccessToken } from "../utils/token";
import { resFormattor } from "../utils/res_formatter";
import { ErrDataNotFound, ErrInvalidRequest, ErrNotAuthorized, ErrSomethingWentWrong } from "../err/error";
import { CustomRequest } from "../model/request";
import { getAccessToken } from "../dao/cache/access_token";
import { GetUserOption } from "../model/sql_option";
import { getOneUser } from '../dao/sql/user'
import { AuthLevel } from "../enum/user";

/**
 * User authentication
 * @param req 
 * @param res 
 * @param next 
 */
export async function authenticator(req: CustomRequest, res: Response, next: NextFunction) {
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

        const getOpt: GetUserOption = {
            userId: payload.userId,
        }

        const profile = await getOneUser(getOpt)
        if (!profile) {
            res.json(resFormattor(ErrDataNotFound.newMsg('Email or password is incorrect.')))
            return
        }

        req.user = profile

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
        if (!req.user) {
            res.json(resFormattor(ErrNotAuthorized))
            return
        }

        if (req.user.authLevel != AuthLevel.ADMIN) {
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