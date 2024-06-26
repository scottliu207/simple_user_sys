import { UserProfile } from '../../model/user_profile'
import { SqlUserProfile } from '../../model/sql/schema'
import { execute } from '../../config/mysql'
import { GetUserOption, GetUsersOption, UpdUserOption } from '../../model/sql_option'
import { paging } from '../../utils/paging'

/** 
 * Inserts a new user.
 * @param input - User's profile.
 * @returns {Promise<void>}
 */
export async function createUser(input: UserProfile): Promise<void> {
    let sql: string = ''
    let params: any[] = []
    sql += ' INSERT INTO `profile` ( '
    sql += '   `id`, '
    sql += '   `username`, '
    sql += '   `account_type`, '
    sql += '   `email`, '
    sql += '   `passphrase`, '
    sql += '   `status` ) '
    sql += ' VALUES (?, ?, ?, ?, ?, ?) '

    params.push(
        input.id,
        input.username,
        input.accountType,
        input.email,
        input.passphrase,
        input.status,
    )

    try {
        await execute(sql, params)
    } catch (error: unknown) {
        throw new Error(`SQL execution failed: create user, ${error}`)
    }
}

/**
 * Updates user's profile.
 * @param userId - User ID.
 * @param option - Update options for filtering user.
 */
export async function updateUser(userId: string, option: UpdUserOption): Promise<void> {
    let sql: string = ''
    let params: any[] = []
    let setSql: string[] = []
    sql += ' UPDATE `profile` SET '
    if (option.username) {
        setSql.push('   `username` = ? ')
        params.push(option.username)
    }

    if (option.accountType) {
        setSql.push('   `account_type` = ? ')
        params.push(option.accountType)
    }

    if (option.passphrase) {
        setSql.push('   `passphrase` = ? ')
        params.push(option.passphrase)
    }

    if (option.status) {
        setSql.push('   `status` = ? ')
        params.push(option.status)
    }

    if (option.lastSessionTime) {
        setSql.push('   `last_session_time` = ? ')
        params.push(option.lastSessionTime)
    }

    if (setSql.length == 0) {
        throw new Error('must provide at least one option param')
    }

    sql = sql.concat(setSql.join(','))

    sql += ' WHERE '
    sql += ' `id` = ? '
    params.push(userId)

    try {
        await execute(sql, params)
    } catch (error: unknown) {
        throw new Error(`SQL execution failed: update user, ${error}`)
    }
}


/** 
 * Gets a user's profile.
 * @param option - Where condition for querying a user.
 * @returns {Promise<UserProfile | null>}
 */
export async function getOneUser(option: GetUserOption): Promise<UserProfile | null> {
    let sql: string = ''
    let params: any[] = []
    let whereSql: string[] = []
    sql += ' SELECT '
    sql += '   `id`, '
    sql += '   `username`, '
    sql += '   `account_type`, '
    sql += '   `email`, '
    sql += '   `passphrase`, '
    sql += '   `status`, '
    sql += '   IF(`last_session_time`="0000-00-00 00:00:00",NULL,last_session_time) as `last_session_time`, '
    sql += '   `create_time`, '
    sql += '   `update_time` '
    sql += ' FROM `profile` '

    if (option.userId) {
        whereSql.push(' `id` = ? ')
        params.push(option.userId)
    }

    if (option.email) {
        whereSql.push(' `email` = ? ')
        params.push(option.email)
    }

    if (option.username) {
        whereSql.push(' `username` = ? ')
        params.push(option.username)
    }

    if (option.status) {
        whereSql.push(' `status` = ? ')
        params.push(option.status)
    }

    if (whereSql.length == 0) {
        throw new Error('must provide at least one param for where caluse')
    }

    sql = sql.concat(' WHERE ', whereSql.join(' AND '))

    try {

        const [row] = await execute(sql, params)
        if (!row) {
            return null
        }

        const result = row as SqlUserProfile;
        const profile: UserProfile = {
            id: result.id,
            username: result.username,
            email: result.email,
            passphrase: result.passphrase,
            accountType: result.account_type,
            status: result.status,
            lastSessionTime: result.last_session_time,
            createTime: result.create_time,
            updateTime: result.update_time,
        }

        return profile

    } catch (error: unknown) {
        throw new Error(`SQL execution failed: get one user, ${error}`)
    }
}

/** 
 * Gets users' profiles.
 * @param option - Where condition for querying users.
 * @returns {Promise<UserProfile[]>} - A list of users' profiles.
 */
export async function getUsers(option: GetUsersOption): Promise<UserProfile[]> {
    let sql: string = ''
    let params: any[] = []
    let whereSql: string[] = []
    sql += ' SELECT '
    sql += '   `id`, '
    sql += '   `username`, '
    sql += '   `account_type`, '
    sql += '   `email`, '
    sql += '   `passphrase`, '
    sql += '   `status`, '
    sql += '   IF(`last_session_time`="0000-00-00 00:00:00",NULL,`last_session_time`) as `last_session_time`, '
    sql += '   `create_time`, '
    sql += '   `update_time` '
    sql += ' FROM `profile` '

    if (option.userId) {
        whereSql.push(' `id` = ? ')
        params.push(option.userId)
    }

    if (option.email) {
        whereSql.push(' `email` = ? ')
        params.push(option.email)
    }

    if (option.username) {
        whereSql.push(' `username` LIKE ? ')
        params.push(`%${option.username}%`)
    }

    if (option.status) {
        whereSql.push(' `status` = ? ')
        params.push(option.status)
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
        let users: UserProfile[] = []
        let rows = await execute(sql, params)
        for (const row of rows) {
            const dbData = row as SqlUserProfile
            const user: UserProfile = {
                id: dbData.id,
                username: dbData.username,
                email: dbData.email,
                passphrase: dbData.passphrase,
                accountType: dbData.account_type,
                status: dbData.status,
                lastSessionTime: dbData.last_session_time,
                createTime: dbData.create_time,
                updateTime: dbData.update_time,
            }
            users.push(user)
        }
        return users

    } catch (error: unknown) {
        throw new Error(`SQL execution failed: get users, ${error}`)
    }
}

/**
 * Gets total number of users.
 * @param option - Where condition for querying total users.
 * @returns {Promise<number>} - Total number of users.
 */
export async function getTotalUser(option: GetUsersOption): Promise<number> {
    let sql: string = ''
    let params: any[] = []
    let whereSql: string[] = []
    sql += ' SELECT COUNT(*) AS `total` FROM `profile`'

    if (option.userId) {
        whereSql.push(' `id` = ? ')
        params.push(option.userId)
    }

    if (option.email) {
        whereSql.push(' `email` = ? ')
        params.push(option.email)
    }

    if (option.username) {
        whereSql.push(' `username` LIKE ? ')
        params.push(`%${option.username}%`)
    }

    if (option.status) {
        whereSql.push(' `status` = ? ')
        params.push(option.status)
    }

    if (whereSql.length != 0) {
        sql = sql.concat(' WHERE ', whereSql.join(' AND '))
    }

    try {
        let [row] = await execute(sql, params)
        const result = row as { total: number }
        return result.total

    } catch (error: unknown) {
        throw new Error(`SQL execution failed: get total user, ${error}`)
    }
}
