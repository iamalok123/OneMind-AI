import { getModel } from "../config/llmModels.js";
import { agentState, AgentStateType } from "./state.js";

const VALID_AGENTS = ["chat", "search", "coding", "pdf", "ppt", "image"] as const;

export const router = async (state: AgentStateType) => {
    const llm = await getModel("router");

    const prompt = `You are an agent router. Your task is to route the user query to the most appropriate agent.

Available Agents:
- chat: General conversation, explanations, learning, and open-ended questions.
- search: Current events, latest news, recent developments, and internet lookups.
- coding: Writing code, debugging, software architecture, technical questions, and API design.
- pdf: Questions about PDF documents, document context, or generating PDFs.
- ppt: Questions about presentations, slide decks, or generating PPTs.
- image: Generating images, editing photos, image prompts, or image analysis.

Instructions:
- Return ONLY the single agent name from the list above.
- Valid choices: chat, search, coding, pdf, ppt, image.
- Do NOT include any extra words, punctuation, explanation, or markdown.

User Query:
${state.prompt}`;

    const response = await llm.invoke(prompt);
    const content = typeof response.content === "string" ? response.content : String(response.content);
    const selected = content.trim().toLowerCase().replace(/['"`]/g, "");
    const normalizedAgent = (VALID_AGENTS as readonly string[]).includes(selected) ? selected : "chat";

    return {
        ...state,
        agent: normalizedAgent
    };
};