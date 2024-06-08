import { Request, Response, NextFunction } from 'express';
import { createUser, getOneUser } from '../dao/sql/profile';
import { SignUpResult } from '../model/response';
import { SignUpRequest } from '../model/request';
import { hashPassword } from '../utils/hash';
import { ErrDataAlreadyExists, ErrInvalidRequest, ErrSomethingWentWrong, ErrNone, ErrPasswordNotMatch, ErrInvalidPassword } from '../err/error';
import { resFormatter } from '../utils/res_formatter';
import { GetUserOption } from '../model/sql_option';
import { validatePassword } from '../utils/password_validator';
import { sendEmail } from '../utils/email';
import { generateJwtToken } from '../utils/token';
import { genUuid } from '../utils/gen_uuid';
import { setEmailToken } from '../dao/cache/email_token';
import { UserProfile } from '../model/user_profile';
import { AccountType, UserStatus } from '../enum/user';

/**
 * Handles user sign-up.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { username, email, password, confirmPassword } = req.body as SignUpRequest;

        if (!username) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('Username is required.')));
            return;
        }

        if (!email) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('Email is required.')));
            return;
        }

        if (!password) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('Password is required.')));
            return;
        }

        if (!confirmPassword) {
            res.json(resFormatter(ErrInvalidRequest.newMsg('Confirm password is required.')));
            return;
        }

        if (!validatePassword(password)) {
            res.json(resFormatter(ErrInvalidPassword.newMsg('Invalid password.')));
            return;
        }

        if (!validatePassword(confirmPassword)) {
            res.json(resFormatter(ErrInvalidPassword.newMsg('Invalid confirm password.')));
            return;
        }

        if (password !== confirmPassword) {
            res.json(resFormatter(ErrPasswordNotMatch));
            return;
        }

        const emailOpt: GetUserOption = {
            email: email,
        };

        const userEmailExist = await getOneUser(emailOpt);
        if (userEmailExist) {
            res.json(resFormatter(ErrDataAlreadyExists.newMsg('Email already exists.')));
            return;
        }

        const hashedPassword = await hashPassword(password);
        const userId = genUuid();
        const emailToken = generateJwtToken(userId);
        const user: UserProfile = {
            id: userId,
            username: username,
            email: email,
            passphrase: hashedPassword,
            accountType: AccountType.EMAIL,
            status: UserStatus.UNVERIFIED,
        };

        await createUser(user);
        await setEmailToken(userId);
        await sendEmail(email, username, emailToken);

        const result: SignUpResult = {
            userId: userId,
        };

        res.json(resFormatter(ErrNone, result));
    } catch (error: unknown) {
        console.log('Unknown error occurred: ' + error);
        res.json(resFormatter(ErrSomethingWentWrong));
    }
}
