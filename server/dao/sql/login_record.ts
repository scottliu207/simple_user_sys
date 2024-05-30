import { LoginRecord } from '../../model/user_profile'
import { SqlLoginRecord } from '../../model/sql_schema'
import { execute } from '../../config/mysql'
import { GetLoginRecordsOption, GetUsersOption } from '../../model/sql_option'
import { paging } from '../../utils/paging'


/** 
 * Insert a new user login record
 * @param input  - user's profile
 * @return {Promise<void>}
*/
export async function createLoginRecord(userId: string): Promise<void> {
    let sql: string = ''
    let params: any[] = []
    sql += ' INSERT INTO `login_record` ( '
    sql += '   `user_id` '
    sql += ' VALUES (?) '

    params.push(userId)

    try {
        await execute(sql, params)
    } catch (error: unknown) {
        let err = 'sql exec failed, Err: ' + error
        console.log(err)
        throw error
    }
}


/** 
 * get user's login records
 * @param {string } option - option for get users 
 * @return {Promise<UserProfile|null>}
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
        rows.forEach((v) => {
            const recordDb = v as SqlLoginRecord
            const record: LoginRecord = {
                id: recordDb.id,
                userId: recordDb.user_id,
                createTime: recordDb.create_time,
                updateTime: recordDb.update_time,
            }
            records.push(record)
        })
        return records

    } catch (error: unknown) {
        console.log('sql exec failed, Err: ' + error)
        throw error
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
    sql += ' SELECT COUNT(*) AS `total` FROM `login_record`'

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
        console.log('sql exec failed, Err: ' + error)
        throw error
    }
}


/** 
 * get user's login records
 * @param {string } option - option for get users 
 * @return {Promise<UserProfile|null>}
*/
export async function getLoginRecordsCountByUser(option: GetLoginRecordsOption): Promise<LoginRecord[]> {
    let sql: string = ''
    let params: any[] = []
    let whereSql: string[] = []
    sql += ' SELECT COUNT(*) as `total` FROM `login_record` '

    if (option.userId) {
        whereSql.push(' `user_id` = ? ')
        params.push(option.userId)
    }

    if (whereSql.length != 0) {
        sql = sql.concat(' WHERE ', whereSql.join(' AND '))
    }

    sql += 'GROUP BY `user_id`'

    try {
        let records: LoginRecord[] = []
        let rows = await execute(sql, params)
        rows.forEach((v) => {
            const recordDb = v as SqlLoginRecord
            const record: LoginRecord = {
                id: recordDb.id,
                userId: recordDb.user_id,
                createTime: recordDb.create_time,
                updateTime: recordDb.update_time,
            }
            records.push(record)
        })
        return records

    } catch (error: unknown) {
        console.log('sql exec failed, Err: ' + error)
        throw error
    }
}
