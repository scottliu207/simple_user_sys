import { redis } from "../../config/redis";
import ms from 'ms';
import { UserProfile } from "../../model/user_profile";
import { genUuid } from "../../utils/gen_uuid";


function getVTKey(userId: string): string {
    return 's:VT:userId:' + userId
}


export async function setVerifyToken(userId: string, token: string) {
    try {
        const key = getVTKey(userId)
        const expiresIn = ms(process.env.JWT_EMAIL_TOKEN_EXPIRE!)
        const res = await redis.set(key, token, 'EX', expiresIn)
        if (res != 'OK') {
            throw new Error('Redis Set Error')
        }
        return
    } catch (error: unknown) {
        throw error
    }
}


export async function getVerifyToken(userId: string): Promise<string | null> {
    const key = getVTKey(userId)
    try {
        const value = await redis.get(key)
        console.log(value)
        return value
    } catch (error: unknown) {
        throw error
    }
}

export async function delVerifyToken(userId: string): Promise<void> {
    const key = getVTKey(userId)
    try {
        await redis.del(key)
        return
    } catch (error: unknown) {
        throw error
    }
}



