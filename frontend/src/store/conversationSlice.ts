import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ConversationData {
    _id?: string;
    title?: string;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
}

interface ConversationState {
    conversations: ConversationData[];
    currentConversation: ConversationData | null;
}

const initialState: ConversationState = {
    conversations: [],
    currentConversation: null,
};

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        setConversations: (state, action: PayloadAction<ConversationData[]>) => {
            state.conversations = action.payload;
        },
        addConversation: (state, action: PayloadAction<ConversationData>) => {
            state.conversations.unshift(action.payload);
        },
        setCurrentConversation: (state, action: PayloadAction<ConversationData | null>) => {
            state.currentConversation = action.payload;
        },
        updateConversation: (state, action: PayloadAction<{ _id: string; title: string }>) => {
            const conv = state.conversations.find((c) => c._id === action.payload._id);
            if (conv) {
                conv.title = action.payload.title;
            }
            if (state.currentConversation && state.currentConversation._id === action.payload._id) {
                state.currentConversation.title = action.payload.title;
            }
        },
        removeConversation: (state, action: PayloadAction<string>) => {
            state.conversations = state.conversations.filter((c) => c._id !== action.payload);
            if (state.currentConversation && state.currentConversation._id === action.payload) {
                state.currentConversation = state.conversations[0] || null;
            }
        },
    }
});

export const {
    setConversations,
    addConversation,
    setCurrentConversation,
    updateConversation,
    removeConversation
} = conversationSlice.actions;
export default conversationSlice.reducer;

