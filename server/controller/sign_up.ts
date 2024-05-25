import { Request, Response, NextFunction } from 'express';
import * as user from '../dao/sql/user';
import { BaseUser } from '../model/user_profile';
import { SignUpResult } from '../model/response';
import { SignUpRequest } from '../model/request';
import { hashPassword } from '../utils/hash';
import { ErrDataAlreadyExists, ErrInvalidRequest, ErrSomethingWentWrong, ErrorCode, ErrNone } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { GetUserOption } from '../model/sql_option';

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
            res.json(resFormattor(ErrInvalidRequest.newMsg('Email is required.')))
            return
        }

        if (!password) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('Password is required.')))
            return
        }

        const getUserOpt: GetUserOption = {
            email: email
        }
        const existedUser = await user.get(getUserOpt)
        if (existedUser) {
            res.json(resFormattor(ErrDataAlreadyExists.newMsg('Email already exists.')))
            return
        }

        const hashedPassword = await hashPassword(password)
        const profile = new BaseUser(email, hashedPassword)
        const userId = await profile.signup()

        const result: SignUpResult = {
            userId: userId,
        }
        res.json(resFormattor(ErrNone, result))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};