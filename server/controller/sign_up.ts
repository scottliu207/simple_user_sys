import { Request, Response, NextFunction } from 'express';
import * as user from '../dao/user';
import { BaseUser } from '../model/user_profile';
import { SignUpResult } from '../model/response';
import { SignUpRequest } from '../model/request';
import { hashPassword } from '../utils/hash';
import { ErrorCode } from '../err/error';
import { responseHandler } from '../utils/res_handler';

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
            res.json(responseHandler(ErrorCode.InvalidRequest, 'Email is required.'))
            return
        }

        if (!password) {
            res.json(responseHandler(ErrorCode.InvalidRequest, 'Password is required.'))
            return
        }

        const existedUser = await user.get(email)
        if (existedUser) {
            res.json(responseHandler(ErrorCode.AccountAlreadyExists, 'Email already exists.'))
            return
        }

        const hashedPassword = await hashPassword(password)
        const profile = new BaseUser(email, hashedPassword)
        const userId = await profile.signup()

        const result: SignUpResult = {
            userId: userId,
        }
        res.json(responseHandler(ErrorCode.SUCCESS, '', result))

    } catch (error: unknown) {
        res.json(responseHandler(ErrorCode.SomethingWentWrong, 'Error occured,' + error))
    }
};