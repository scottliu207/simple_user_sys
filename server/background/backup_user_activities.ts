import { getUserAcivityKey, redisGetUserActivity } from '../dao/cache/user_activity'
import { getUserList } from '../controller/get_users'
import { getUsers, updateUser } from '../dao/sql/profile'
import { GetUserOption, GetUsersOption, UpdUserOption } from '../model/sql_option'
import { AuthLevel, UserStatus } from '../enum/user'
import { GetDayStartAndEnd } from '../utils/time'
import { createUserSessionReport } from '../dao/sql/user_session_report'
import { UserSessionReport } from '../model/user_session_report'
import { redisDel } from '../dao/cache/basic'


export async function backUpUserActivites() {

    let getUsersOpt: GetUsersOption = {
        status: UserStatus.ENABLE,
        authLevel: AuthLevel.USER,
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
                const reportData: UserSessionReport = {
                    userId: user.id,
                    startTime: day.startTime,
                    endTime: day.endTime,
                    sessionCount: userActivity.count,
                }
                await createUserSessionReport(reportData)


                const key = getUserAcivityKey(user.id)
                await redisDel(key)
            }

            if (users.length < getUsersOpt.perPage) {
                break
            }

            getUsersOpt.page++
        }
    } catch (error: unknown) {
        console.log(`Unknown error occured while backing up user session, ${error}`)
        return
    }
}