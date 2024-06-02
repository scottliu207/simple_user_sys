import { Response, NextFunction } from 'express';
import { CustomRequest, GetUsersRequest, } from '../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrInvalidUser, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { AuthLevel, UserStatus } from '../enum/user';
import { GetUserOption, GetUsersOption } from '../model/sql_option';
import { getOneUser, getTotalUser, getUsers } from '../dao/sql/profile';
import { GetUserResult, GetUsersResult, GetUsersResultRow } from '../model/response';

/**
 * Handles user logout.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function getUserList(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { userId, email, username, status, page, perPage } = req.body as GetUsersRequest

        if (!page) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('page is required.')))
            return
        }

        if (!perPage) {
            res.json(resFormattor(ErrInvalidRequest.newMsg('perPage is required.')))
            return
        }

        const getUsersOpt: GetUsersOption = {
            userId: userId,
            username: username,
            email: email,
            status: status,
            page: page,
            perPage: perPage
        }

        const users = await getUsers(getUsersOpt)
        const total = await getTotalUser(getUsersOpt)
        const result: GetUsersResult = {
            data: [],
            total: total,
        }
        for (const user of users) {
            const row: GetUsersResultRow = {
                userId: user.id,
                email: user.email,
                username: user.username,
                accountType: user.accountType,
                status: user.status,
                lastSessionTime: user.lastSessionTime,
                createTime: user.createTime ?? new Date(0),
                updateTime: user.updateTime ?? new Date(0),
            }
            result.data.push(row)
        }

        res.json(resFormattor(ErrNone, result))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};