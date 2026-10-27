import Conversation from "../models/conversation.model.js";
import { Request, Response } from "express";
import Message from "../models/message.model.js";

export const createConversation = async (req: Request, res: Response) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const conversation = await Conversation.create({
            title: req.body.title,
            userId: userId as string
        })
        return res.status(201).json(conversation)
    } catch (error: any) {
        return res.status(500).json({ error: `Error in creating conversation ${error}` })
    }
}



export const getConversations = async (req: Request, res: Response) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const conversation = await Conversation.find({
            userId: userId as string
        }).sort({ updatedAt: -1 })
        return res.status(200).json(conversation)
    } catch (error: any) {
        return res.status(500).json({ error: `Error in getting conversations ${error}` })
    }
}


export const updateConversationTitle = async (req: Request, res: Response) => {
    try {
        const {conversationId, title} = req.body
        const conversation = await Conversation.findByIdAndUpdate(
            conversationId, 
            {title: title}, 
            {new: true}
        )
        return res.status(200).json(conversation)
    } catch (error: any) {
        return res.status(500).json({ error: `Update conversation ${error}` })
    }
}


export const saveMessage = async (req: Request, res: Response) => {
    try {
        const {conversationId, role, content} = req.body
        const message = await Message.create ({
            conversationId,
            role,
            content
        })
        return res.status(201).json(message)
    } catch (error: any) {
        return res.status(500).json({ error: `Save message ${error}` })
    }
}


export const getMessage = async (req: Request, res: Response) => {
    try {
        const conversationId = req.params.conversationId
        if (!conversationId) {
            return res.status(400).json({ error: "Conversation Id is required" })
        }
        const messages = await Message.find ({
            conversationId
        }).sort({createdAt: 1})
        return res.status(200).json({
            status: "success",
            messages
        })
    } catch (error: any) {
        return res.status(500).json({ error: `Get message ${error}` })
    }
}