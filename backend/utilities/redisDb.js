const Redis = require('redis');
const redisClient = Redis.createClient();


const connectRedis = async() => {
    redisClient.on("error", err => {
        console.log('Redis error: ', err);
    })
    await redisClient.connect();
    console.log('Redis connected');
}

connectRedis();

module.exports = redisClient;