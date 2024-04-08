import { createClient } from "redis";

const redisClient = await createClient({
    username: import.meta.env.REDIS_USERNAME,
    password: import.meta.env.REDIS_PASSWORD,
    socket: {
        port: import.meta.env.REDIS_PORT,
        host: import.meta.env.REDIS_HOST,
    },
})
    .connect()
    .catch((error) => {
        console.error("Redis connection failed: ", error);
        process.exit(1);
    });

type RedisClientType = typeof redisClient;

class RedisUtil {
    constructor(public readonly redisClient: RedisClientType) {}
}

const redisUtil = new RedisUtil(redisClient);

export default redisUtil;
