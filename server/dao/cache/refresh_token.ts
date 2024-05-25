import { redis } from "../../config/redis";
import ms from 'ms';

function getRTKey(tokenId: string): string {
    return 's:RT:tokenID:' + tokenId
}

export async function setRefreshToken(userId: string, token: string) {
    const key = getRTKey(userId)
    try {
        const expiresIn = ms(process.env.JWT_REFRESH_TOKEN_EXPIRE!)
        await redis.set(key, token, 'EX', expiresIn)
        return
    } catch (error: unknown) {
        throw error
    }
}

export async function getRefreshToken(tokenId: string): Promise<string> {
    const key = getRTKey(tokenId)
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

export async function delRefreshToken(tokenId: string): Promise<void> {
    const key = getRTKey(tokenId)
    try {
        await redis.del(key)
        return
    } catch (error: unknown) {
        throw error
    }
}

