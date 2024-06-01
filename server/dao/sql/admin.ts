import { execute } from '../../config/mysql'
import { Admin } from '../../model/admin'
import { UserStatus } from '../../enum/user'

export type GetOneAdminOpt = {
    userId?: string;
    email?: string;
}

type SqlGetAdmin = {
    id: string;
    email: string;
    passphrase: string;
    status: UserStatus;
    create_time?: Date;
    update_time?: Date;
}
/** 
 * get a user's profile
 * @param {string } userId - user id 
 * @param {string } email  - user's email
 * @return {Promise<Admin|null>}
*/
export async function getOneAdmin(option: GetOneAdminOpt): Promise<Admin | null> {
    let sql: string = ''
    let params: any[] = []
    let whereSql: string[] = []
    sql += ' SELECT '
    sql += '   `id`, '
    sql += '   `email`, '
    sql += '   `passphrase`, '
    sql += '   `status`, '
    sql += '   `create_time`, '
    sql += '   `update_time` '
    sql += ' FROM `admin` '

    if (option.userId) {
        whereSql.push(' `id` = ? ')
        params.push(option.userId)
    }

    if (option.email) {
        whereSql.push(' `email` = ? ')
        params.push(option.email)
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

        const result = row as SqlGetAdmin;
        const profile: Admin = {
            id: result.id,
            email: result.email,
            passphrase: result.passphrase,
            status: result.status,
            createTime: result.create_time,
            updateTime: result.update_time,
        }

        return profile

    } catch (error: unknown) {
        throw new Error(`sql exec failed-get one admin, ${error}`)
    }
}