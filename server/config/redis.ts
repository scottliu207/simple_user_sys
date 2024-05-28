import Redis, { RedisOptions } from 'ioredis'

const option: RedisOptions = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
    username: process.env.REDIS_USER || '',
    password: process.env.REDIS_PASSWORD || '',
    db: process.env.REDIS_DB ? +process.env.REDIS_DB : 0,
}



export const redis = new Redis(option)

redis.on('error', (error: Error) => {
    console.log('Redis Error: ' + error)
})

/**
 * 
*/
export async function pingRedis() {

    try {
        const pong = await redis.ping()
        if (pong) {
            console.log('Successfully connect to Redis.')
        }
    } catch (error: unknown) {
        console.log('Unexpected error occured, Error: ' + error)
        throw error
    }
}

