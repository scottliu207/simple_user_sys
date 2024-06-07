import { NextFunction, Response } from 'express';
import { redisSetUserActivity } from '../dao/cache/user_activity';
import { CustomRequest } from '../model/request';

/**
 * Middleware to track user session activity.
 * @param req - Custom request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function userSessionTracker(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    if (!req.userId) {
        next();
        return;
    }

    try {
        await redisSetUserActivity(req.userId);
    } catch (error: unknown) {
        console.error('Error setting user activity:', error);
    }

    next();
}
