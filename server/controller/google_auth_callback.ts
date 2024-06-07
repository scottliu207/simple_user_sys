import { Request, Response, NextFunction } from 'express';
import { ErrDataNotFound, ErrInvalidRequest, ErrInvalidToken, ErrInvalidUser, ErrNone, ErrSomethingWentWrong } from '../err/error';
import { resFormatter } from '../utils/res_formatter';
import { createUser, getOneUser, updateUser } from '../dao/sql/profile';
import { verifyPassword } from '../utils/hash';
import { GetUserOption, UpdUserOption } from '../model/sql_option';
import { AccountType, UserStatus } from '../enum/user';
import { generateToken } from '../utils/token';
import { Token, redisGetUserToken, redisSetUserToken } from '../dao/cache/user_token';
import { createLoginRecord } from '../dao/sql/login_record';
import { UserProfile } from '../model/user_profile';
import { genUuid } from '../utils/gen_uuid';
import { updateProfile } from './update_profile';
import { AuthGoogle } from '../auth/google';
import { redisSetUserActivity } from '../dao/cache/user_activity';
import { SignInResult } from '../model/response';

/**
 * Handles Google authentication callback.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function googleAuthCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code } = req.body;
    if (!code) {
      res.json(resFormatter(ErrInvalidRequest.newMsg('Code is required.')));
      return;
    }
    const decodedCode = decodeURIComponent(code);
    const google = new AuthGoogle();
    const token = await google.getToken(decodedCode);
    if (!token || !token.idToken || !token.accessToken || !token.refreshToken) {
      res.json(resFormatter(ErrInvalidRequest.newMsg('Invalid auth code')));
      return;
    }

    const payload = await google.getUserProfile(token.idToken);
    if (!payload) {
      res.json(resFormatter(ErrInvalidToken));
      return;
    }

    if (!payload.email) {
      res.json(resFormatter(ErrSomethingWentWrong.newMsg('Failed to retrieve the email from OAuth.')));
      return;
    }

    const getUserOpt: GetUserOption = {
      email: payload.email,
    };

    let user = await getOneUser(getUserOpt);
    if (!user) {
      const userId = genUuid();
      const profile: UserProfile = {
        id: userId,
        username: payload.name ? payload.name : userId,
        passphrase: '',
        accountType: AccountType.GOOGLE,
        status: UserStatus.ENABLE,
        email: payload.email,
      };

      await createUser(profile);
      user = profile;
    } else {
      const updOpt: UpdUserOption = {
        accountType: AccountType.GOOGLE,
        passphrase: '',
      };
      await updateUser(user.id, updOpt);
    }

    const accessToken: Token = { token: token.accessToken, expiresIn: process.env.ACCESS_TOKEN_EXPIRE! };
    const refreshToken: Token = { token: token.refreshToken, expiresIn: process.env.REFRESH_TOKEN_EXPIRE! };
    const userToken = await redisGetUserToken(user.id);

    await redisSetUserToken(user.id, userToken, accessToken, refreshToken);
    await createLoginRecord(user.id);
    await redisSetUserActivity(user.id);

    const result: SignInResult = {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };

    res.json(resFormatter(ErrNone, result));
  } catch (error: unknown) {
    console.log('Unknown error occurred: ' + error);
    res.json(resFormatter(ErrSomethingWentWrong));
  }
}
