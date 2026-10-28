import { api } from "../utils/axios";

export const updateConversationTitle = async (conversationId: string, title: string) => {
    try {
        const { data } = await api.post("/api/chat/update-conversation-title", { conversationId, title });
        return data;
    } catch (error) {
        console.log("Error updating conversation title:", error);
        return null;
    }
};
