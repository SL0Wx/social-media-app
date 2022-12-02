import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
    {
        chatName: {
            type: String,
            trim: true,
        },
        isGroupChat: {
            type: Boolean,
            default: false,
        },
        users: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
        latestMessage: {
            type: mongoose.Types.ObjectId,
            ref: "Message",
        },
    },
    { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;