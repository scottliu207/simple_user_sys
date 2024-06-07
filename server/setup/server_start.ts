
import { userRouteV1 } from '../routes/users';
import { responseHandler } from '../middleware/response_handler';
import { pingRedis, redis } from '../config/redis';
import { pingMySql, pool as mysqlPool } from '../config/mysql';
import express from 'express';
import cookieParser from 'cookie-parser';
import { extractToken } from '../middleware/extract_token';
import schedule from 'node-schedule'
import { backUpUserActivites } from '../background/backup_user_activities';
import { callbackRouteV1 } from '../routes/callback';
import { userSessionTracker } from '../middleware/user_session_tracker';

const app = express();

const port: number = process.env.SERVER_PORT ? +process.env.SERVER_PORT : 3000;

export async function start() {
    try {
        redis.on('error', (error: Error) => {
            console.log('Redis Error: ' + error)
        })

        await pingMySql()
        await pingRedis()

    } catch (error: unknown) {
        await cleanUp()
        console.log('Server faild to set up,', error)
        process.exit(1)
    }

    app.use(express.json())
    app.use(cookieParser())
    app.use(responseHandler)

    app.use(extractToken)
    app.use('/api/user/v1', userRouteV1)
    app.use('/api/callback/v1', callbackRouteV1)

    app.listen(port, () => {
        console.log(`server is listening on ${port}`);
    });

    schedule.scheduleJob(process.env.SCHEDULE_SETTING!, backUpUserActivites);
}

async function cleanUp() {
    if (mysqlPool) {
        await mysqlPool.end();
    }

    if (redis) {
        await redis.quit()
    }
}