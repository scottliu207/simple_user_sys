import { redis } from '../../config/redis';
import ms from 'ms';

function getEmailTokenKey(userId: string): string {
    return 's:ET:' + userId;
}

/**
 * Sets the email token for a user with an expiration time.
 * @param userId - The user ID.
 * @returns The number of email tokens set for the user.
 */
export async function setEmailToken(userId: string): Promise<number> {
    const key = getEmailTokenKey(userId);
    try {
        const expiresIn = ms(process.env.EMAIL_TOKEN_EXPIRE!) / 1000;
        const pipeline = redis.multi();
        pipeline.incr(key);
        pipeline.expire(key, expiresIn);
        const result = await pipeline.exec();
        if (!result) {
            return 0;
        }
        return result[0][1] as number;
    } catch (error: unknown) {
        throw error;
    }
}

/**
 * Gets the email token count for a user.
 * @param userId - The user ID.
 * @returns The number of email tokens for the user.
 */
export async function getEmailToken(userId: string): Promise<number> {
    const key = getEmailTokenKey(userId);
    try {
        const value = await redis.get(key);
        if (!value) {
            return 0;
        }
        return +value;
    } catch (error: unknown) {
        throw error;
    }
}

/**
 * Deletes the email token for a user.
 * @param userId - The user ID.
 */
export async function delEmailToken(userId: string): Promise<void> {
    const key = getEmailTokenKey(userId);
    try {
        await redis.del(key);
    } catch (error: unknown) {
        throw error;
    }
}
