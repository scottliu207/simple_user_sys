
import { userRouteV1 } from '../routes/users';
import { responseHandler } from '../middleware/response_handler';
import { PingRedis } from '../config/redis';
import { pingMySql } from '../config/db';
import express from 'express';


const app = express();

const port: number = process.env.SERVER_PORT ? +process.env.SERVER_PORT : 3000;

export async function start() {
    await pingMySql()
    await PingRedis()

    app.use(express.json())
    app.use(responseHandler)

    app.get('/', (req, res) => {
        res.send('The server is working!');
    });

    app.use('/user/v1', userRouteV1)


    app.listen(port, () => {
        console.log(`server is listening on ${port}`);
    });
}