import { LoginRecord } from '../../model/user_profile'
import { SqlLoginRecord } from '../../model/sql_schema'
import { execute } from '../../config/mysql'
import { GetUserSessionReportOption, GetUsersOption } from '../../model/sql_option'
import { UserActivityReport } from '../../model/user_activity_report'


/** 
 * Insert a new user login record
 * @param input  - user's profile
 * @return {Promise<void>}
*/
export async function createUserActivityReport(reportData: UserActivityReport): Promise<void> {
    let sql: string = ''
    let params: any[] = []
    sql += ' INSERT INTO `user_activity_report` ( '
    sql += '   `user_id`,  '
    sql += '   `start_time`,  '
    sql += '   `end_time`,  '
    sql += '   `user_activity_count` )  '
    sql += ' VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE'
    sql += ' `user_activity_count`= `user_activity_count`+ ?'

    params.push(reportData.userId)
    params.push(reportData.startTime)
    params.push(reportData.endTime)
    params.push(reportData.userActivityCount)
    params.push(reportData.userActivityCount)
    try {
        await execute(sql, params)
    } catch (error: unknown) {
        throw new Error(`sql exec failed-create user activity report, ${error}`)
    }
}


/** 
 * get user's login records
 * @param {string } option - option for get users 
 * @return {Promise<UserProfile|null>}
*/
export async function getUserActivityReport(option: GetUserSessionReportOption): Promise<LoginRecord[]> {
    let sql: string = ''
    let params: any[] = []
    let whereSql: string[] = []
    sql += ' SELECT '
    sql += '   `user_id`, '
    sql += '   `start_time`,  '
    sql += '   `end_time`,  '
    sql += '   `user_activity_count` '
    sql += ' FROM `user_activity_report` '

    if (option.userId) {
        whereSql.push(' `user_id` = ? ')
        params.push(option.userId)
    }

    if (option.startTime) {
        whereSql.push(' `start_time` = ? ')
        params.push(option.startTime)
    }

    if (option.startTime) {
        whereSql.push(' `end_time` = ? ')
        params.push(option.endTime)
    }

    if (whereSql.length != 0) {
        sql = sql.concat(' WHERE ', whereSql.join(' AND '))
    }

    try {
        let records: LoginRecord[] = []
        let rows = await execute(sql, params)
        for (const row of rows) {
            const dataDb = row as SqlLoginRecord
            const record: LoginRecord = {
                id: dataDb.id,
                userId: dataDb.user_id,
                createTime: dataDb.create_time,
                updateTime: dataDb.update_time,
            }
            records.push(record)

        }
        return records

    } catch (error: unknown) {
        throw new Error(`sql exec failed-get user activity report, ${error}`)
    }
}

/**
 * 
 * @param option 
 * @returns 
 */
export async function getTotalRecord(option: GetUsersOption): Promise<number> {
    let sql: string = ''
    let params: any[] = []
    let whereSql: string[] = []
    sql += ' SELECT COUNT(*) AS `total` FROM `user_activity_report`'

    if (option.userId) {
        whereSql.push(' `user_id` = ? ')
        params.push(option.userId)
    }

    if (whereSql.length != 0) {
        sql = sql.concat(' WHERE ', whereSql.join(' AND '))
    }

    try {
        let [row] = await execute(sql, params)
        const result = row as { total: number }
        return result.total

    } catch (error: unknown) {
        throw new Error(`sql exec failed-get total user activity report, ${error}`)
    }
}

/** 
 * get user's login records
 * @param {string } option - option for get users 
 * @return {Promise<UserProfile|null>}
*/
export async function getTotalUserActivityByDay(startTime: Date, endTime: Date): Promise<number> {
    let sql: string = ''
    let params: any[] = []
    sql += ' SELECT '
    sql += '   COUNT(DISTINCT `user_id`) AS `total_user` '
    sql += ' FROM `user_activity_report` '
    sql += ' WHERE '
    sql += '   `start_time` >= ? AND `end_time` <= ? '
    params.push(startTime, endTime)
    sql += 'GROUP BY `start_time`, `end_time`'

    try {
        let total: number = 0
        let rows = await execute(sql, params)
        for (const row of rows) {
            const data = row as { total_user: number }
            total += data.total_user
        }

        return total

    } catch (error: unknown) {
        throw new Error(`sql exec failed-get total user activity by day, ${error}`)
    }
}