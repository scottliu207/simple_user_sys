import { NextFunction,  Response } from "express";
import { redisSetUserActivity } from "../dao/cache/user_activity";
import { CustomRequest } from "../model/request";



export async function userSessionTracker(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.userId) {
        next()
        return
    }

    try {
        await redisSetUserActivity(req.userId)
    } catch (error: unknown) {
        throw error
    }
    
    next()
}