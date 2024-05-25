import { SqlUserProfile, UserProfile } from '../../model/user_profile'
import { execute, query } from '../../config/db'
import { GetUserOption, UpdUserOption } from '../../model/sql_option'


/** 
 * Insert a new user
 * @param input  - user's profile
 * @return {Promise<void>}
*/
export async function create(input: UserProfile): Promise<void> {
    let sql: string = ""
    let params: any[] = []
    sql += " INSERT INTO `user_db`.`profile` ( "
    sql += "   `id`, "
    sql += "   `username`, "
    sql += "   `account_type`, "
    sql += "   `email`, "
    sql += "   `passphrase`, "
    sql += "   `status` ) "
    sql += " VALUES (?, ?, ?, ?, ?, ?) "

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
export async function update(userId: string, option: UpdUserOption): Promise<void> {
    let sql: string = ""
    let params: any[] = []
    let setSql: string[] = []
    sql += " UPDATE `user_db`.`profile` SET "
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

    if (setSql.length == 0) {
        throw new Error("must provide at least one option param")
    }

    sql = sql.concat(setSql.join(","))

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
export async function get(option: GetUserOption): Promise<UserProfile | null> {
    let sql: string = ""
    let params: any[] = []
    let whereSql: string[] = []
    sql += " SELECT "
    sql += "   `id`, "
    sql += "   `username`, "
    sql += "   `account_type`, "
    sql += "   `email`, "
    sql += "   `passphrase`, "
    sql += "   `status`, "
    sql += "   `create_time`, "
    sql += "   `update_time` "
    sql += " FROM `user_db`.`profile` "

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

    if (whereSql.length == 0) {
        throw new Error("must provide at least one param for where caluse")
    }


    sql = sql.concat(" WHERE ", whereSql.join(" AND "))


    try {
        let result = await query(sql, params)
        if (result.length === 0) {
            return null
        }

        const profileSql = result[0] as SqlUserProfile;
        const profile: UserProfile = {
            id: profileSql.id,
            username: profileSql.username,
            email: profileSql.email,
            passphrase: profileSql.passphrase,
            accountType: profileSql.account_type,
            status: profileSql.status,
            createTime: profileSql.create_time,
            updateTime: profileSql.update_time,
        }

        return profile

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