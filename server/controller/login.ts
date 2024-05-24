import { Request, Response, NextFunction } from 'express';
import { LoginRequest } from '../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrNone, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import * as user from '../dao/user'
import { genShortToken } from '../utils/token';
import { verifyPassword } from '../utils/hash';

/**
 * Handles user login.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body as LoginRequest
        if (!email) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('Email is required.')))
            return
        }

        if (!password) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('Password is required.')))
            return
        }

        const existedUser = await user.get(email)
        if (!existedUser) {
            res.json(resFormattor(ErrDataNotFound.newMsg('Email or password is incorrect.')))
            return
        }


        const match = await verifyPassword(password, existedUser.passphrase)
        if (!match) {
            res.json(resFormattor(ErrDataNotFound.newMsg('Email or password is incorrect.')))
            return
        }

        const token = await genShortToken(existedUser.id)

        res.json(resFormattor(ErrNone, token))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};