import { getModel } from "../config/llmModels.js";
import { AgentStateType } from "../graph/state.js";

export const chatAgent = async (state: AgentStateType) => {
    const llm = await getModel("chat");
    const systemPrompt = "You are OneMind-AI, an intelligent AI assistant.";
    const response = await llm.invoke([
        {
            role: "system",
            content: systemPrompt
        },
        {
            role: "human",
            content: state.prompt
        }
    ]);

    return {
        ...state,
        aiResponse: response.content
    };
};
