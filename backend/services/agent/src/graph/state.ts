import { Annotation } from "@langchain/langgraph";

export const agentState = Annotation.Root({
    prompt: Annotation<string>(),
    aiResponse: Annotation<string>(),
    agent: Annotation<string>()
});

export type AgentStateType = typeof agentState.State;