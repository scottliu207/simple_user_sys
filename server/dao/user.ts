import { UserProfile } from '../model/user_profile'
import { execute, query } from '../config/db'


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
    sql += "   `account_type`, "
    sql += "   `email`, "
    sql += "   `passphrase`, "
    sql += "   `status` ) "
    sql += " VALUES (?, ?, ?, ?, ?) "

    params.push(
        input.id,
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

// export async function update(input: UserProfile): Promise<void> {
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


/** 
 * get a user's profile
 * @param {string } userId  - user id 
 * @param {string } email  - user's email
 * @return {Promise<UserProfile|null>}
*/
export async function get(email: string): Promise<UserProfile | null> {
    let sql: string = ""
    let params: any[] = []
    let whereSql: string[] = []
    sql += " SELECT "
    sql += "   `id`, "
    sql += "   `account_type`, "
    sql += "   `email`, "
    sql += "   `passphrase`, "
    sql += "   `status`, "
    sql += "   `create_time`, "
    sql += "   `update_time` "
    sql += " FROM `user_db`.`profile` "

    // if (userId) {
    //     whereSql.push(" `id` = ? ")
    //     params.push(userId)
    // }

    if (email) {
        whereSql.push(" `email` = ? ")
        params.push(email)
    }

    if (whereSql.length == 0) {
        throw new Error("must provide at least one param")
    }

    sql = sql.concat(" WHERE ", whereSql.join(" AND "))

    try {
        let result = await query(sql, params)
        if (result.length === 0) {
            return null
        }

        const profile = result[0] as UserProfile;
        return profile
    } catch (error: unknown) {
        let err = "sql exec failed, Err: " + error
        console.log(err)
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