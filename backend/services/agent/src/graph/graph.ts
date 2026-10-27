import { StateGraph, START, END } from "@langchain/langgraph";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { imageAgent } from "../agents/image.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { agentState, AgentStateType } from "./state.js";

const workflow = new StateGraph(agentState)
    .addNode("router", router)
    .addNode("chat", chatAgent)
    .addNode("search", searchAgent)
    .addNode("coding", codingAgent)
    .addNode("image", imageAgent)
    .addNode("ppt", pptAgent)
    .addNode("pdf", pdfAgent);

workflow.addEdge(START, "router");

workflow.addConditionalEdges(
    "router",
    (state: AgentStateType) => {
        switch (state.agent) {
            case "chat":
                return "chat";
            case "search":
                return "search";
            case "coding":
                return "coding";
            case "pdf":
                return "pdf";
            case "ppt":
                return "ppt";
            case "image":
                return "image";
            default:
                return "chat";
        }
    },
    {
        chat: "chat",
        search: "search",
        coding: "coding",
        pdf: "pdf",
        ppt: "ppt",
        image: "image"
    }
);

workflow.addEdge("search", "chat");
workflow.addEdge("chat", END);
workflow.addEdge("coding", END);
workflow.addEdge("pdf", END);
workflow.addEdge("ppt", END);
workflow.addEdge("image", END);

export const graph = workflow.compile();