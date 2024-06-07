import { redis } from '../../config/redis';
import { getTimestamp } from '../../utils/time';

export function getUserActivityKey(userId: string): string {
    return `s:activity:userId:${userId}`;
}

type UserActivity = {
    timestamp: Date;
    count: number;
};

/**
 * Sets the user activity in Redis.
 * @param userId - The user ID.
 */
export async function redisSetUserActivity(userId: string): Promise<void> {
    const key = getUserActivityKey(userId);
    const timestamp = getTimestamp(new Date());
    try {
        let count = 1;
        const preCount = await redis.hget(key, 'count');
        if (preCount) {
            count += +preCount;
        }

        const pipeline = redis.multi();
        pipeline.hset(key, 'timestamp', timestamp);
        pipeline.hset(key, 'count', count);
        await pipeline.exec();
    } catch (error: unknown) {
        throw error;
    }
}

/**
 * Gets the user activity from Redis.
 * @param userId - The user ID.
 * @returns The user activity or null if not found.
 */
export async function redisGetUserActivity(userId: string): Promise<UserActivity | null> {
    const key = getUserActivityKey(userId);
    try {
        const { timestamp, count } = await redis.hgetall(key);
        if (!timestamp) {
            return null;
        }

        const timestampInMs = +timestamp * 1000;
        const userActivity: UserActivity = {
            timestamp: new Date(timestampInMs),
            count: +count,
        };
        return userActivity;
    } catch (error: unknown) {
        throw error;
    }
}
