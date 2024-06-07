import { Response, NextFunction } from 'express';
import { CustomRequest } from '../model/request';
import { resFormatter } from '../utils/res_formatter';
import { GetUserOption } from '../model/sql_option';
import { getOneUser } from '../dao/sql/profile';
import { GetUserResult } from '../model/response';
import { ErrDataNotFound, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';

/**
 * Handles user profile retrieval.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function getProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      res.json(resFormatter(ErrNotAuthorized));
      return;
    }

    const getUserOpt: GetUserOption = {
      userId: req.userId,
    };

    const user = await getOneUser(getUserOpt);
    if (!user) {
      res.json(resFormatter(ErrDataNotFound.newMsg('User not found.')));
      return;
    }

    const result: GetUserResult = {
      userId: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
      accountType: user.accountType,
    };

    res.json(resFormatter(ErrNone, result));
  } catch (error: unknown) {
    console.log('Unknown error occurred: ' + error);
    res.json(resFormatter(ErrSomethingWentWrong));
  }
}
