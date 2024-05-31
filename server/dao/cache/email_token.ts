import { redis } from "../../config/redis";
import ms from 'ms';

function getEmailTokenKey(userId: string): string {
    return 's:ET:' + userId
}

export async function setEmailToken(userId: string): Promise<number> {
    const key = getEmailTokenKey(userId)
    try {
        const expiresIn = ms(process.env.EMAIL_TOKEN_EXPIRE!)
        const pipeline = redis.multi()
        pipeline.incr(key)
        pipeline.expire(key, expiresIn)
        const result = await pipeline.exec()
        if (!result) {
            return 0
        }
        return result[0][1] as number
    } catch (error: unknown) {
        throw error
    }
}

export async function getEmailToken(userId: string): Promise<number> {
    const key = getEmailTokenKey(userId)
    try {
        const value = await redis.get(key)
        if (!value) {
            return 0
        }
        return +value
    } catch (error: unknown) {
        throw error
    }
}

export async function delEmailToken(userId: string): Promise<void> {
    const key = getEmailTokenKey(userId)
    try {
        await redis.del(key)
        return
    } catch (error: unknown) {
        throw error
    }
}



