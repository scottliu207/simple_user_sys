import { redis } from '../../config/redis';
import ms from 'ms';

export function getUserTokenKey(userId: string): string {
    return `h:token:userId:${userId}`;
}

export type Token = {
    token: string;
    expiresIn: string;
};

type UserToken = {
    accessToken: string;
    refreshToken: string;
};

/**
 * Sets the user tokens in Redis.
 * @param userId - The user ID.
 * @param curUserToken - The current user tokens.
 * @param newAccessToken - The new access token.
 * @param newRefreshToken - The new refresh token.
 */
export async function redisSetUserToken(
    userId: string,
    curUserToken: UserToken,
    newAccessToken: Token,
    newRefreshToken: Token
): Promise<void> {
    const key = getUserTokenKey(userId);
    try {
        const pipeline = redis.multi();
        pipeline.hset(key, 'accessToken', newAccessToken.token);
        pipeline.hset(key, 'refreshToken', newRefreshToken.token);
        pipeline.expire(key, ms(newRefreshToken.expiresIn) / 1000);
        pipeline.del(curUserToken.accessToken);
        pipeline.del(curUserToken.refreshToken);
        pipeline.set(newAccessToken.token, userId, 'EX', ms(newAccessToken.expiresIn) / 1000);
        pipeline.set(newRefreshToken.token, userId, 'EX', ms(newRefreshToken.expiresIn) / 1000);

        await pipeline.exec();
    } catch (error: unknown) {
        throw error;
    }
}

/**
 * Gets the user tokens from Redis.
 * @param userId - The user ID.
 * @returns The user tokens.
 */
export async function redisGetUserToken(userId: string): Promise<UserToken> {
    const key = getUserTokenKey(userId);
    try {
        const record = await redis.hgetall(key);
        return record as UserToken;
    } catch (error: unknown) {
        throw error;
    }
}

/**
 * Updates the access token in Redis.
 * @param userId - The user ID.
 * @param accessToken - The new access token.
 */
export async function redisUpdateAccessToken(userId: string, accessToken: string): Promise<void> {
    const key = getUserTokenKey(userId);
    try {
        await redis.hset(key, 'accessToken', accessToken);
    } catch (error: unknown) {
        throw error;
    }
}

/**
 * Clears the user tokens from Redis.
 * @param userId - The user ID.
 * @param userToken - The user tokens to clear.
 */
export async function redisClearUserToken(userId: string, userToken: UserToken): Promise<void> {
    const key = getUserTokenKey(userId);
    try {
        const pipeline = redis.multi();
        pipeline.del(key);
        pipeline.del(userToken.accessToken);
        pipeline.del(userToken.refreshToken);
        await pipeline.exec();
    } catch (error: unknown) {
        throw error;
    }
}
