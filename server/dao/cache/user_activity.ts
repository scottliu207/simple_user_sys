import { pipeline } from "stream";
import { redis } from "../../config/redis";
import { getTimestamp } from "../../utils/time";


export function getUserAcivityKey(userId: string): string {
    return `s:acticity:userId:${userId}`
}

type UserActivity = {
    timestamp: Date;
    count: number;
}

export async function redisSetUserActivity(userId: string): Promise<void> {
    const key = getUserAcivityKey(userId)
    const timestamp = getTimestamp(new Date())
    try {
        
        let count = 1
        const preCount = await redis.hget(key, 'count')
        if (preCount) {
            count += +preCount
        }

        const pipeline = redis.multi()
        pipeline.hset(key, 'timestamp', timestamp)
        pipeline.hset(key, 'count', count)
        await pipeline.exec()
        return
    } catch (error: unknown) {
        throw error
    }
}

export async function redisGetUserActivity(userId: string): Promise<UserActivity | null> {
    const key = getUserAcivityKey(userId)
    try {
        const { timestamp, count } = await redis.hgetall(key)
        if (!timestamp) {
            return null
        }

        const timestampInMiliSec = +timestamp*1000
        const userActivity: UserActivity = {
            timestamp: new Date(timestampInMiliSec),
            count: +count,
        }
        return userActivity
    } catch (error: unknown) {
        throw error
    }
}

