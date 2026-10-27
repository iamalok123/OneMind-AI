import express from "express";
import {
    createConversation,
    getConversations,
    updateConversationTitle,
    saveMessage,
    getMessage
} from "../controllers/chat.controller.js";

const router = express.Router();

// Conversation routes
router.post("/create-conversation", createConversation);
router.get("/get-conversations", getConversations);
router.post("/update-conversation-title", updateConversationTitle);

// Message routes
router.post("/save-message", saveMessage);
router.get("/get-message/:conversationId", getMessage);


export default router;
