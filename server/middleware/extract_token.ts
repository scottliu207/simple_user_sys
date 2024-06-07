import { NextFunction, Response } from 'express';
import { CustomRequest } from '../model/request';

/**
 * Middleware to extract the token from the Authorization header.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function extractToken(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    const auth = req.headers.authorization;
    if (auth) {
        const authSplit = auth.split(' ');
        if (authSplit.length === 2) {
            const token = authSplit[1];
            req.accessToken = token;
        }
    }
    next();
}
