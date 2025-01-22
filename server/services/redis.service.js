import dotenv from "dotenv";
dotenv.config();

import redis from "ioredis";
console.log(
    process.env.REDIS_HOST,
    process.env.REDIS_PORT,
     process.env.REDIS_PASSWORD 
)

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});


redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});


// module.exports = redisClient;

export default redisClient;