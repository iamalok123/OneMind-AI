import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../models/user.model.js";
import redis, { getSessionKey } from "@onemind/shared/redis";

export const login = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "ID token is required"
            });
        }

        const decoded = await getAuth(app).verifyIdToken(token);
        let user = await User.findOne({
            firebaseUid: decoded.uid,
            email: decoded.email,
        })

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                email: decoded.email,
                name: decoded.name,
                avatar: decoded.picture,
            })
        }

        const sessionId = crypto.randomUUID()
        await redis.set(getSessionKey(sessionId), JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }), "EX", 7 * 24 * 60 * 60)

        res.cookie("session-id", sessionId, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            data: decoded,
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error from login",
            error: error
        })
    }
};

export const logOut = async (req: Request, res: Response) => {
    try {
        const sessionId = req.cookies?.["session-id"];

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "No active session found"
            });
        }

        await redis.del(getSessionKey(sessionId));
        res.clearCookie("session-id", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error during logout",
            error
        });
    }
};
