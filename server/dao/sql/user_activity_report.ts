import { execute } from '../../config/mysql'
import { GetUsersOption } from '../../model/sql_option'
import { UserActivityReport } from '../../model/user_activity_report'


/** 
 * Inserts a new user's activity report.
 * @param reportData - Activity report data.
 * @returns {Promise<void>}
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
        throw new Error(`SQL execution failed: create user activity report, ${error}`)
    }
}

/** 
 * Gets total user activity report by day.
 * @param startTime - Condition for filtering start time.
 * @param endTime - Condition for filtering end time.
 * @returns {Promise<number>} - Total user activity report.
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
        throw new Error(`SQL execution failed: get total user activity by day, ${error}`)
    }
}