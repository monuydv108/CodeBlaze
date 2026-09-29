const { RateLimiterRedis } = require('rate-limiter-flexible');
const redisClient = require('../config/redisClient');

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'submission_limit',
    points: 5,        // 🔥 5 requests
    duration: 60,     // 🔥 per 60 seconds
});

const rateLimiterMiddleware = async (req, res, next) => {
    try {
        const userId = req.result?._id || req.ip;

        await rateLimiter.consume(userId.toString());

        next();
    } catch (rejRes) {
        res.status(429).json({
            success: false,
            message: "Too many submissions. Please try again later."
        });
    }
};

module.exports = rateLimiterMiddleware;