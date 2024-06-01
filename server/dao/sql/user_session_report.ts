import { LoginRecord } from '../../model/user_profile'
import { SqlLoginRecord } from '../../model/sql_schema'
import { execute } from '../../config/mysql'
import { GetLoginRecordsOption, GetUserSessionReportOption, GetUsersOption } from '../../model/sql_option'
import { paging } from '../../utils/paging'
import { UserSessionReport } from '../../model/user_session_report'
import { TotalUserSessionByDay } from '../../model/sql/user_session_report'


/** 
 * Insert a new user login record
 * @param input  - user's profile
 * @return {Promise<void>}
*/
export async function createUserSessionReport(reportData: UserSessionReport): Promise<void> {
    let sql: string = ''
    let params: any[] = []
    sql += ' INSERT INTO `user_session_report` ( '
    sql += '   `user_id`,  '
    sql += '   `start_time`,  '
    sql += '   `end_time`,  '
    sql += '   `session_count` )  '
    sql += ' VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE'
    sql += ' `session_count`= `session_count`+ ?'

    params.push(reportData.userId)
    params.push(reportData.startTime)
    params.push(reportData.endTime)
    params.push(reportData.sessionCount)
    params.push(reportData.sessionCount)
    try {
        await execute(sql, params)
    } catch (error: unknown) {
        throw new Error(`sql exec failed-create user session report, ${error}`)
    }
}


/** 
 * get user's login records
 * @param {string } option - option for get users 
 * @return {Promise<UserProfile|null>}
*/
export async function getUserSessionReport(option: GetUserSessionReportOption): Promise<LoginRecord[]> {
    let sql: string = ''
    let params: any[] = []
    let whereSql: string[] = []
    sql += ' SELECT '
    sql += '   `user_id`, '
    sql += '   `start_time`,  '
    sql += '   `end_time`,  '
    sql += '   `session_count` '
    sql += ' FROM `user_session_report` '

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
        throw new Error(`sql exec failed-get user session report, ${error}`)
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
    sql += ' SELECT COUNT(*) AS `total` FROM `user_session_report`'

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
        throw new Error(`sql exec failed-get total user session report, ${error}`)
    }
}

/** 
 * get user's login records
 * @param {string } option - option for get users 
 * @return {Promise<UserProfile|null>}
*/
export async function getTotalUserSessionByDay(startTime: Date, endTime: Date): Promise<number> {
    let sql: string = ''
    let params: any[] = []
    sql += ' SELECT '
    sql += '   COUNT(DISTINCT `user_id`) AS `total_user` '
    sql += ' FROM `user_session_report` '
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
        throw new Error(`sql exec failed-get total user session by day, ${error}`)
    }
}