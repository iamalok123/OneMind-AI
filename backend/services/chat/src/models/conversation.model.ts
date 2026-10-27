import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: String
    }
}, { timestamps: true })

const Conversation = mongoose.model("Conversation", conversationSchema)
export default Conversation