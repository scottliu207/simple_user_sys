import { SqlUserProfile, UserProfile } from '../../model/user_profile'
import { execute } from '../../config/mysql'
import { GetUserOption, GetUsersOption, UpdUserOption } from '../../model/sql_option'
import { paging } from '../../utils/paging'


/** 
 * Insert a new user
 * @param input  - user's profile
 * @return {Promise<void>}
*/
export async function createUser(input: UserProfile): Promise<void> {
    let sql: string = ""
    let params: any[] = []
    sql += " INSERT INTO `profile` ( "
    sql += "   `id`, "
    sql += "   `username`, "
    sql += "   `account_type`, "
    sql += "   `auth_level`, "
    sql += "   `email`, "
    sql += "   `passphrase`, "
    sql += "   `status` ) "
    sql += " VALUES (?, ?, ?, ?, ?, ?, ?) "

    params.push(
        input.id,
        input.username,
        input.accountType,
        input.authLevel,
        input.email,
        input.passphrase,
        input.status,
    )

    try {
        await execute(sql, params)
    } catch (error: unknown) {
        let err = "sql exec failed, Err: " + error
        console.log(err)
        throw error
    }
}

/**
 * 
 * @param userId 
 * @param option 
 */
export async function updateUser(userId: string, option: UpdUserOption): Promise<void> {
    let sql: string = ""
    let params: any[] = []
    let setSql: string[] = []
    sql += " UPDATE `profile` SET "
    if (option.username) {
        setSql.push("   `username` = ? ")
        params.push(option.username)
    }

    if (option.accountType) {
        setSql.push("   `account_type` = ? ")
        params.push(option.accountType)
    }

    if (option.passphrase) {
        setSql.push("   `passphrase` = ? ")
        params.push(option.passphrase)
    }

    if (option.status) {
        setSql.push("   `status` = ? ")
        params.push(option.status)
    }

    if (setSql.length == 0) {
        throw new Error("must provide at least one option param")
    }

    sql = sql.concat(setSql.join(","))

    sql += ' WHERE '
    sql += ' `id` = ? '
    params.push(userId)

    try {
        await execute(sql, params)
    } catch (error: unknown) {
        console.log("sql exec failed, Err: " + error)
        throw error
    }
}


/** 
 * get a user's profile
 * @param {string } userId - user id 
 * @param {string } email  - user's email
 * @return {Promise<UserProfile|null>}
*/
export async function getOneUser(option: GetUserOption): Promise<UserProfile | null> {
    let sql: string = ""
    let params: any[] = []
    let whereSql: string[] = []
    sql += " SELECT "
    sql += "   `id`, "
    sql += "   `username`, "
    sql += "   `account_type`, "
    sql += "   `auth_level`, "
    sql += "   `email`, "
    sql += "   `passphrase`, "
    sql += "   `status`, "
    sql += "   `create_time`, "
    sql += "   `update_time` "
    sql += " FROM `profile` "

    if (option.userId) {
        whereSql.push(" `id` = ? ")
        params.push(option.userId)
    }

    if (option.email) {
        whereSql.push(" `email` = ? ")
        params.push(option.email)
    }

    if (option.username) {
        whereSql.push(" `username` = ? ")
        params.push(option.username)
    }

    if (option.status) {
        whereSql.push(" `status` = ? ")
        params.push(option.status)
    }

    if (whereSql.length == 0) {
        throw new Error("must provide at least one param for where caluse")
    }


    sql = sql.concat(" WHERE ", whereSql.join(" AND "))


    try {
        let [row] = await execute(sql, params)
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
            authLevel: result.auth_level,
            status: result.status,
            createTime: result.create_time,
            updateTime: result.update_time,
        }

        return profile

    } catch (error: unknown) {
        console.log("sql exec failed, Err: " + error)
        throw error
    }
}

/** 
 * get a user's profile
 * @param {string } option - option for get users 
 * @return {Promise<UserProfile|null>}
*/
export async function getUsers(option: GetUsersOption): Promise<UserProfile[]> {
    let sql: string = ""
    let params: any[] = []
    let whereSql: string[] = []
    sql += " SELECT "
    sql += "   `id`, "
    sql += "   `username`, "
    sql += "   `account_type`, "
    sql += "   `auth_level`, "
    sql += "   `email`, "
    sql += "   `passphrase`, "
    sql += "   `status`, "
    sql += "   `create_time`, "
    sql += "   `update_time` "
    sql += " FROM `profile` "

    if (option.userId) {
        whereSql.push(" `id` = ? ")
        params.push(option.userId)
    }

    if (option.email) {
        whereSql.push(" `email` = ? ")
        params.push(option.email)
    }

    if (option.username) {
        whereSql.push(" `username` LIKE ? ")
        params.push(`%${option.username}%`)
    }

    if (option.status) {
        whereSql.push(" `status` = ? ")
        params.push(option.status)
    }

    if (option.authLevel) {
        whereSql.push(" `auth_level` = ? ")
        params.push(option.authLevel)
    }

    if (whereSql.length != 0) {
        sql = sql.concat(" WHERE ", whereSql.join(" AND "))
    }

    if (option.page && option.perPage) {
        const pagingSql = paging(option.page, option.perPage)
        sql += " LIMIT ? OFFSET ? "
        params.push(pagingSql.limit)
        params.push(pagingSql.offset)
    }

    try {
        let users: UserProfile[] = []
        let rows = await execute(sql, params)
        rows.forEach((v) => {
            const profileDb = v as SqlUserProfile
            const user: UserProfile = {
                id: profileDb.id,
                username: profileDb.username,
                email: profileDb.email,
                passphrase: profileDb.passphrase,
                accountType: profileDb.account_type,
                authLevel: profileDb.auth_level,
                status: profileDb.status,
                createTime: profileDb.create_time,
                updateTime: profileDb.update_time,
            }
            users.push(user)
        })
        return users

    } catch (error: unknown) {
        console.log("sql exec failed, Err: " + error)
        throw error
    }
}

export async function getTotalUser(option: GetUsersOption): Promise<number> {
    let sql: string = ""
    let params: any[] = []
    let whereSql: string[] = []
    sql += " SELECT COUNT(*) AS `total` FROM `profile`"

    if (option.userId) {
        whereSql.push(" `id` = ? ")
        params.push(option.userId)
    }

    if (option.email) {
        whereSql.push(" `email` = ? ")
        params.push(option.email)
    }

    if (option.username) {
        whereSql.push(" `username` LIKE ? ")
        params.push(`%${option.username}%`)
    }

    if (option.status) {
        whereSql.push(" `status` = ? ")
        params.push(option.status)
    }

    if (option.authLevel) {
        whereSql.push(" `auth_level` = ? ")
        params.push(option.authLevel)
    }

    if (whereSql.length != 0) {
        sql = sql.concat(" WHERE ", whereSql.join(" AND "))
    }

    try {
        let [row] = await execute(sql, params)
        const result = row as { total: number }
        return result.total

    } catch (error: unknown) {
        console.log("sql exec failed, Err: " + error)
        throw error
    }
}

// export async function del(userId: string): Promise<void> {
//     let sql: string = ""
//     let params: any[] = []
//     sql += " INSERT INTO `user_db`.`profile` ( "
//     sql += "   `id`, "
//     sql += "   `account_type`, "
//     sql += "   `email`, "
//     sql += "   `passpharse`, "
//     sql += "   `status`, "
//     sql += "   `create_time`, "
//     sql += "   `update_time`) "
//     sql += " VALUES (?, ?, ?, ?, ?, ?, ?, ?) "

//     params.push(
//         input.id,
//         input.accountType,
//         input.email,
//         input.passpharse,
//         input.status,
//         input.createTime,
//         input.updateTime,
//     )

//     try {
//         await execute(sql, params)
//     } catch (error: unknown) {
//         let err = "sql exec failed, Err: " + error
//         console.log(err)
//         throw error
//     }
// }