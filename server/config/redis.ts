import Redis, { RedisOptions } from 'ioredis';

const options: RedisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
  username: process.env.REDIS_USER || '',
  password: process.env.REDIS_PASSWORD || '',
  db: process.env.REDIS_DB ? +process.env.REDIS_DB : 0,
};

export const redis = new Redis(options);

redis.on('error', (error: Error) => {
  console.log('Redis Error: ' + error);
});

/**
 * Pings Redis to check the connection.
 */
export async function pingRedis(): Promise<void> {
  try {
    const pong = await redis.ping();
    if (pong) {
      console.log('Successfully connected to Redis.');
    }
  } catch (error: unknown) {
    console.log('Unexpected error occurred, Error: ' + error);
    throw error;
  }
}
