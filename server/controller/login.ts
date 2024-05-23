import { Request, Response, NextFunction } from 'express';

/**
 * Handles user login.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const login = (req: Request, res: Response, next: NextFunction): void => {
    res.send('Login');
};