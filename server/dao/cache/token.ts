import { redis } from "../../config/redis";
import ms from 'ms';


export function getUserTokenKey(userId: string): string {
    return `h:token:userId:${userId}`
}

export type Token = {
    token: string;
    expriresIn: string;
}

type UserToken = {
    accessToken: string;
    refreshToken: string;
}

export async function redisSetUserToken(userId: string, accessToken: Token, refreshToken: Token) {
    const key = getUserTokenKey(userId)
    try {
        const pipeline = redis.multi()
        pipeline.hset(key, 'accessToken', accessToken.token)
        pipeline.hset(key, 'refreshToken', refreshToken.token)
        pipeline.expire(key, ms(refreshToken.expriresIn))
        pipeline.set(accessToken.token, userId, 'EX', ms(accessToken.expriresIn))
        pipeline.set(refreshToken.token, userId, 'EX', ms(refreshToken.expriresIn))
        await pipeline.exec()
        return
    } catch (error: unknown) {
        throw error
    }
}

export async function redisGetUserToken(userId: string): Promise<UserToken> {
    const key = getUserTokenKey(userId)
    try {
        const record = await redis.hgetall(key)
        return record as UserToken
    } catch (error: unknown) {
        throw error
    }
}


export async function redisUpdateAccessToken(userId: string, accessToken: string): Promise<void> {
    const key = getUserTokenKey(userId)
    try {
        const _ = await redis.hset(key, 'accessToken', accessToken)
        return
    } catch (error: unknown) {
        throw error
    }
}

export async function redisClearUserToken(userId: string, userToken: UserToken): Promise<void> {
    const key = getUserTokenKey(userId)
    try {
        const pipeline = redis.multi()
        pipeline.del(key)
        pipeline.del(userToken.accessToken)
        pipeline.del(userToken.refreshToken)
        const _ = await pipeline.exec()
        return
    } catch (error: unknown) {
        throw error
    }
}

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

