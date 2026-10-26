import { Request, Response, NextFunction } from "express";
import redis, { getSessionKey } from "@onemind/shared/redis";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionId = req.cookies?.["session-id"];
        if (!sessionId) {
            return res.status(401).json({ message: "Unauthorized - No session provided" });
        }

        const session = await redis.get(getSessionKey(sessionId));
        if (!session) {
            return res.status(401).json({ message: "Session expired or invalid" });
        }

        try {
            (req as any).user = JSON.parse(session);
        } catch {
            return res.status(401).json({ message: "Corrupted session data" });
        }

        next();
    } catch (error: any) {
        return res.status(500).json({ message: `Authentication error: ${error?.message || error}` });
    }
};