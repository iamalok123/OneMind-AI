import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

let groqInstance: ChatGroq | null = null;
let geminiInstance: ChatGoogleGenerativeAI | null = null;

const getGroq = () => {
    if (!groqInstance) {
        groqInstance = new ChatGroq({
            model: "openai/gpt-oss-120b",
            apiKey: process.env.GROQ_API_KEY
        });
    }
    return groqInstance;
};

const getGemini = () => {
    if (!geminiInstance) {
        geminiInstance = new ChatGoogleGenerativeAI({
            model: "gemini-3.8-flash",
            apiKey: process.env.GOOGLE_API_KEY
        });
    }
    return geminiInstance;
};

export const getModel = async (agentType: string) => {
    switch (agentType) {
        case "chat":
        case "search":
        case "router":
            return getGroq();
        case "coding":
            return getGemini();
        default:
            return getGroq();
    }
};