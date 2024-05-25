import { redis } from "../../config/redis";
import ms from 'ms';
import { UserProfile } from "../../model/user_profile";


function getATKey(userId: string): string {
    return 's:AT:userId:' + userId
}


export async function setAccessToken(user: UserProfile) {
    try {
        const key = getATKey(user.id)
        const expiresIn = ms(process.env.JWT_ACCESS_TOKEN_EXPIRE!)
        await redis.set(key, user.id, 'EX', expiresIn)
        return
    } catch (error: unknown) {
        throw error
    }
}


export async function getAccessToken(userId: string): Promise<string> {
    const key = getATKey(userId)
    try {
        const value = await redis.get(key)
        if (!value) {
            throw new Error('Redis key not found.')
        }
        return value
    } catch (error: unknown) {
        throw error
    }
}

export async function delAccessToken(userId: string): Promise<void> {
    const key = getATKey(userId)
    try {
        await redis.del(key)
        return
    } catch (error: unknown) {
        throw error
    }
}



