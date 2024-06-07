import { LoginRecord } from '../../model/login_record'
import { SqlLoginRecord } from '../../model/sql/schema'
import { execute } from '../../config/mysql'
import { GetLoginRecordsOption, GetUsersOption } from '../../model/sql_option'
import { paging } from '../../utils/paging'

/** 
 * Inserts a new user login record.
 * @param userId - The user ID.
 * @returns {Promise<void>}
 */
export async function createLoginRecord(userId: string): Promise<void> {
    let sql: string = ''
    let params: any[] = []
    sql += ' INSERT INTO `login_record` ( '
    sql += '   `user_id` ) '
    sql += ' VALUES (?) '

    params.push(userId)

    try {
        await execute(sql, params)
    } catch (error: unknown) {
        throw new Error(`SQL execution failed: create login record user, ${error}`)
    }
}

/** 
 * Gets user's login records.
 * @param option - Where condition for querying user's login records.
 * @returns {Promise<LoginRecord[]>} - A list of user's login records.
 */
export async function getLoginRecords(option: GetLoginRecordsOption): Promise<LoginRecord[]> {
    let sql: string = ''
    let params: any[] = []
    let whereSql: string[] = []
    sql += ' SELECT '
    sql += '   `id`, '
    sql += '   `user_id`, '
    sql += '   `create_time`, '
    sql += '   `update_time` '
    sql += ' FROM `login_record` '

    if (option.userId) {
        whereSql.push(' `user_id` = ? ')
        params.push(option.userId)
    }

    if (whereSql.length != 0) {
        sql = sql.concat(' WHERE ', whereSql.join(' AND '))
    }

    if (option.page && option.perPage) {
        const pagingSql = paging(option.page, option.perPage)
        sql += ' LIMIT ? OFFSET ? '
        params.push(pagingSql.limit)
        params.push(pagingSql.offset)
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
        throw new Error(`SQL execution failed: get login records, ${error}`)
    }
}
