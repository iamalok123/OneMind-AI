import redis, { SESSION_PREFIX, getSessionKey } from "./redis/redis.js";

export default redis;
export { redis, SESSION_PREFIX, getSessionKey };
