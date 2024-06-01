import { Request, Response, NextFunction } from 'express';
import { getOneUser } from '../../dao/sql/profile';
import { BaseUser } from '../../model/user_profile';
import { SignUpResult } from '../../model/response';
import { SignUpRequest } from '../../model/request';
import { hashPassword } from '../../utils/hash';
import { ErrDataAlreadyExists, ErrInvalidRequest, ErrSomethingWentWrong, ErrNone, ErrPasswordNotMatch, ErrInvalidPassword } from '../../err/error';
import { resFormattor } from '../../utils/res_formatter';
import { GetUserOption } from '../../model/sql_option';
import { validatePassword } from '../../utils/password_validator';
import { sendEmail } from '../../utils/email';
import { generateJwtToken } from '../../utils/token';
import { genUuid } from '../../utils/gen_uuid';
import { setEmailToken } from '../../dao/cache/email_token';

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

        const emailOpt: GetUserOption = {
            email: email,
        }

        const userEmailExist = await getOneUser(emailOpt)
        if (userEmailExist) {
            res.json(resFormattor(ErrDataAlreadyExists.newMsg('email already exists.')))
            return
        }

        const nameOpt: GetUserOption = {
            username: username,
        }
        const usernameExist = await getOneUser(nameOpt)
        if (usernameExist) {
            res.json(resFormattor(ErrDataAlreadyExists.newMsg('username already exists.')))
            return
        }

        const hashedPassword = await hashPassword(password)
        const userId = genUuid()
        const emailToken = generateJwtToken(userId)
        const profile = new BaseUser(username, email, hashedPassword, userId)
        const _ = await profile.create()

        const result: SignUpResult = {
            userId: userId,
        }

        await setEmailToken(userId)
        await sendEmail(email, username, emailToken)

        res.json(resFormattor(ErrNone, result))
        return
    } catch (error: unknown) {
        console.log('Unkonwn error occured, ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
        return
    }
};