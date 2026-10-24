import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../models/user.model.js";

export const login = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
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

        res.cookie("session-id", sessionId, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7*24*60*60*1000
        })

        return res.status(200).json({
            success: true,
            data: decoded,
            user 
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error fron login",
            error: error
        })
    }
};
