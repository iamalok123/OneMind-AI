import { api } from "../utils/axios"

export const createConversation = async (title: string = "New Chat") => {
    try {
        const { data } = await api.post("/api/chat/create-conversation", { title })
        return data;
    } catch (error) {
        console.log("Error creating conversation:", error)
        return null;
    }
}