import { Request, Response, NextFunction } from 'express';
import * as user from '../dao/user';
import { BaseUser } from '../model/user_profile';
import { SignUpRequest } from '../model/request';

/**
 * Handles user sign-up.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function signUp(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const { email, password } = req.body as SignUpRequest
        if (!email) {
            res.json("Email is required.")
            return
        }

        if (!password) {
            res.json("Password is required.")
            return 
        }

        let existedUser = await user.get(email)
        if (existedUser) {
            res.json("Email already exists.")
        }

        // hash password
        let profile = new BaseUser(email, password)
        let userId = await profile.signup()

        res.json('User has created successfully, UserId: ' + userId);
    } catch (error: unknown) {
        res.json("Error occured, " + error)
    }
};