import { Request, Response, NextFunction } from 'express';
import * as user from '../dao/sql/user';
import { BaseUser } from '../model/user_profile';
import { SignUpResult } from '../model/response';
import { SignUpRequest } from '../model/request';
import { hashPassword } from '../utils/hash';
import { ErrDataAlreadyExists, ErrInvalidRequest, ErrSomethingWentWrong, ErrorCode, ErrNone, ErrPasswordNotMatch, ErrInvalidPassword } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { GetUserOption } from '../model/sql_option';
import { validatePassword } from '../utils/password_validator';

/**
 * Handles user sign-up.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function signUp(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const { username, email, password, confirmPassword } = req.body as SignUpRequest
        if (!username) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('username is required.')))
            return
        }

        if (!email) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('email is required.')))
            return
        }

        if (!password) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('password is required.')))
            return
        }

        if (!confirmPassword) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('confirmPassword is required.')))
            return
        }

        if (!validatePassword(password)) {
            res.json(resFormattor(ErrInvalidPassword.newMsg('Invalid password')))
            return
        }

        if (!validatePassword(confirmPassword)) {
            res.json(resFormattor(ErrInvalidPassword.newMsg('Invalid confirm password')))
            return
        }

        if (password != confirmPassword) {
            res.json(resFormattor(ErrPasswordNotMatch))
            return
        }

        const emailOption: GetUserOption = {
            email: email,
        }

        const emailExist = await user.get(emailOption)
        if (emailExist) {
            res.json(resFormattor(ErrDataAlreadyExists.newMsg('email already exists.')))
            return
        }

        const nameOption: GetUserOption = {
            username: username,
        }
        const nameExist = await user.get(nameOption)
        if (nameExist) {
            res.json(resFormattor(ErrDataAlreadyExists.newMsg('username already exists.')))
            return
        }

        const hashedPassword = await hashPassword(password)
        const profile = new BaseUser(username, email, hashedPassword)
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