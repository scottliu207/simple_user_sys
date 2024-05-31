import ms from "ms"
import { redis } from "../../config/redis"

export async function redisSet(key: string, userId: string, expiresIn: string): Promise<void> {
    try {
        const _ = await redis.set(key, userId, 'EX', ms(expiresIn))
    } catch (error: unknown) {
        throw error
    }
}

export async function redisGet(key: string): Promise<string | null> {
    try {
        const value = await redis.get(key)
        return value
    } catch (error: unknown) {
        throw error
    }
}

export async function redisDel(key: string): Promise<void> {
    try {
        const _ = await redis.del(key)
        return
    } catch (error: unknown) {
        throw error
    }
}