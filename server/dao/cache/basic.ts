import ms from 'ms'
import { redis } from '../../config/redis'

/**
 * Sets a key-value pair in Redis with an expiration time.
 * @param key - The key to set.
 * @param userId - The value to set for the key.
 * @param expiresIn - The expiration time in a human-readable format (e.g., '1h', '30m').
 */
export async function redisSet(key: string, userId: string, expiresIn: string): Promise<void> {
    try {
        await redis.set(key, userId, 'EX', ms(expiresIn) / 1000)
    } catch (error: unknown) {
        throw error
    }
}


/**
 * Gets the value of a key from Redis.
 * @param key - The key to get.
 * @returns The value of the key, or null if the key does not exist.
 */
export async function redisGet(key: string): Promise<string | null> {
    try {
        const value = await redis.get(key)
        return value
    } catch (error: unknown) {
        throw error
    }
}


/**
 * Deletes a key from Redis.
 * @param key - The key to delete.
 */
export async function redisDel(key: string): Promise<void> {
    try {
        const _ = await redis.del(key)
        return
    } catch (error: unknown) {
        throw error
    }
}