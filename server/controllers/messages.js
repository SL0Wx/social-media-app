import Message from "../models/Message.js";
import User from "../models/User.js";
import Chat from "../models/Chat.js";

const sendMessage = async (req, res) => {
    const { message, chatId } = req.body;

    if (!message || !chatId) {
        return res.send("Please provide all fields to send message");
    }

    let newMessage = {
        sender: req.user.id,
        message: message,
        chatId: chatId,
    };
}