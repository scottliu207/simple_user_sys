import { getUserAcivityKey, redisGetUserActivity } from '../dao/cache/user_activity'
import { getUsers, updateUser } from '../dao/sql/profile'
import { GetUsersOption, UpdUserOption } from '../model/sql_option'
import { UserStatus } from '../enum/user'
import { GetDayStartAndEnd } from '../utils/time'
import { redisDel } from '../dao/cache/basic'
import { createUserActivityReport } from '../dao/sql/user_activity_report'
import { UserActivityReport } from '../model/user_activity_report'


export async function backUpUserActivites() {
    let getUsersOpt: GetUsersOption = {
        status: UserStatus.ENABLE,
        page: 1,
        perPage: 1
    }

    try {
        while (true) {
            const users = await getUsers(getUsersOpt)
            for (const user of users) {
                const userActivity = await redisGetUserActivity(user.id)
                if (!userActivity) {
                    continue
                }

                const updOpt: UpdUserOption = {
                    lastSessionTime: userActivity.timestamp
                }
                await updateUser(user.id, updOpt)

                const day = GetDayStartAndEnd(new Date(userActivity.timestamp))
                const reportData: UserActivityReport = {
                    userId: user.id,
                    startTime: day.startTime,
                    endTime: day.endTime,
                    userActivityCount: userActivity.count,
                }
                await createUserActivityReport(reportData)


                const key = getUserAcivityKey(user.id)
                await redisDel(key)
            }

            if (users.length < getUsersOpt.perPage!) {
                break
            }

            getUsersOpt.page!++
        }
    } catch (error: unknown) {
        console.log(`Unknown error occured while backing up user session, ${error}`)
        return
    }
}