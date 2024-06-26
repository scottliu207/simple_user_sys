import { Response, NextFunction } from 'express';
import { CustomRequest } from '../model/request';
import { ErrNone, ErrSomethingWentWrong } from '../err/error';
import { resFormatter } from '../utils/res_formatter';
import { GetUsersOption } from '../model/sql_option';
import { getTotalUser } from '../dao/sql/profile';
import { GetReportResult } from '../model/response';
import { GetDayStartAndEnd } from '../utils/time';
import { getTotalUserActivityByDay } from '../dao/sql/user_activity_report';

/**
 * Handles user's activites report generation.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export async function getUserReport(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const getUsersOpt: GetUsersOption = {};

    const totalSignUp = await getTotalUser(getUsersOpt);

    const currentTime = new Date();
    const currentDay = GetDayStartAndEnd(currentTime);
    const totalUserToday = await getTotalUserActivityByDay(currentDay.startTime, currentDay.endTime);

    const newStartDate = currentDay.startTime.getUTCDate() - 7;
    currentDay.startTime.setUTCDate(newStartDate);

    const totalUserSevenDay = await getTotalUserActivityByDay(currentDay.startTime, currentDay.endTime);

    const result: GetReportResult = {
      totalSignUp: totalSignUp,
      totalActiveUserToday: totalUserToday,
      avgActiveUserLastSevenDay: parseFloat((totalUserSevenDay / 7).toFixed(2)),
    };

    res.json(resFormatter(ErrNone, result));
  } catch (error: unknown) {
    console.log('Unknown error occurred: ' + error);
    res.json(resFormatter(ErrSomethingWentWrong));
  }
}
