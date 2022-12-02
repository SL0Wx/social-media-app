import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        message: {
            type: String,
            trim: true,
        },
        chatId: {
            type: mongoose.Types.ObjectId,
            ref: "Chat",
        },
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;