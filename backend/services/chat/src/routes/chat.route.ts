import express from "express";
import {
    createConversation,
    getConversations,
    updateConversationTitle,
    deleteConversation,
    saveMessage,
    getMessage
} from "../controllers/chat.controller.js";

const router = express.Router();

// Conversation routes
router.post("/create-conversation", createConversation);
router.get("/get-conversations", getConversations);
router.post("/update-conversation-title", updateConversationTitle);
router.delete("/delete-conversation/:conversationId", deleteConversation);
router.post("/delete-conversation", deleteConversation);

// Message routes
router.post("/save-message", saveMessage);
router.get("/get-message/:conversationId", getMessage);


export default router;
