import { Response, NextFunction } from 'express';
import { CustomRequest, GetUsersRequest, } from '../model/request';
import { ErrDataNotFound, ErrInvalidRequest, ErrInvalidUser, ErrNone, ErrNotAuthorized, ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import { AuthLevel, UserStatus } from '../enum/user';
import { GetUserOption, GetUsersOption } from '../model/sql_option';
import { getOneUser, getTotalUser, getUsers } from '../dao/sql/profile';
import { GetReportResult, GetUserResult, GetUsersResult, GetUsersResultRow } from '../model/response';
import { getTotalUserSessionByDay } from '../dao/sql/user_session_report';
import { GetDayStartAndEnd } from '../utils/time';

/**
 * Handles user logout.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function getUserReport(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {

        const getUsersOpt: GetUsersOption = {
            authLevel: AuthLevel.USER,
        }

        const totalSignUp = await getTotalUser(getUsersOpt)


        const currentTime = new Date()
        const currentDay = GetDayStartAndEnd(currentTime)
        const totalUserToday = await getTotalUserSessionByDay(currentDay.startTime, currentDay.endTime)

        const newStartDate = currentDay.startTime.getUTCDate() - 7
        currentDay.startTime.setUTCDate(newStartDate)

        const totalUserSevenDay = await getTotalUserSessionByDay(currentDay.startTime, currentDay.endTime)
        const result: GetReportResult = {
            totalSignUp: totalSignUp,
            totalActiveUserToday: totalUserToday,
            avgActiveUserLastSevenDay: totalUserSevenDay
        }

        res.json(resFormattor(ErrNone, result))

    } catch (error: unknown) {
        console.log('Unkonwn error occured: ' + error)
        res.json(resFormattor(ErrSomethingWentWrong))
    }
};