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

export async function redisSetUserToken(userId: string, curUserToken: UserToken, newAccessToken: Token, newRefreshToken: Token) {
    const key = getUserTokenKey(userId)
    try {
        const pipeline = redis.multi()
        pipeline.hset(key, 'accessToken', newAccessToken.token)
        pipeline.hset(key, 'refreshToken', newRefreshToken.token)
        pipeline.expire(key, ms(newRefreshToken.expriresIn)/1000)
        pipeline.del(curUserToken.accessToken)
        pipeline.del(curUserToken.refreshToken)
        pipeline.set(newAccessToken.token, userId, 'EX', ms(newAccessToken.expriresIn) / 1000)
        pipeline.set(newRefreshToken.token, userId, 'EX', ms(newRefreshToken.expriresIn) / 1000)

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
