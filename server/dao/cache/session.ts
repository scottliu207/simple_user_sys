import { redis } from "../../config/redis";
import ms from 'ms';
import { UserProfile } from "../../model/user_profile";


function getRedisSessionKey(userId: string): string {
    return 's:session:userId:' + userId
}

export async function setRedisSession(userId: string, sessionId: string) {
    try {
        const key = getRedisSessionKey(userId)
        const expiresIn = ms(process.env.USER_SESSION_EXPIRE!)
        await redis.set(key, sessionId, 'EX', expiresIn)
        return
    } catch (error: unknown) {
        throw error
    }
}

export async function getRedisSession(userId: string): Promise<string | null> {

    const redisKey = getRedisSessionKey(userId)
    try {
        const value = await redis.get(redisKey)
        return value
    } catch (error: unknown) {
        throw error
    }
}

export async function delRedisSession(userId: string): Promise<void> {
    const key = getRedisSessionKey(userId)
    try {
        await redis.del(key)
        return
    } catch (error: unknown) {
        throw error
    }
}



