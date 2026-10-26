import { Redis } from "ioredis";

export const SESSION_PREFIX = "session:";

export const getSessionKey = (sessionId: string): string => {
    return `${SESSION_PREFIX}${sessionId}`;
};

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
        // Exponential backoff with a cap of 2000ms
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

redis.on("connect", () => {
    console.log("Redis connected successfully");
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});

export default redis;
export { redis };
