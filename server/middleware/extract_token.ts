import { NextFunction, Response } from "express";
import { CustomRequest } from "../model/request";

/**
 * User authentication
 * @param req 
 * @param res 
 * @param next 
 */
export async function extractToken(req: CustomRequest, res: Response, next: NextFunction) {
    const auth = req.headers.authorization
    if (auth) {
        const authSplit = auth.split(' ')
        if (authSplit.length == 2) {
            const token = authSplit[1];
            req.accessToken = token
        }
    }
    next()
}