import { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import { Box, Typography, InputBase, useTheme, Button } from "@mui/material";
import UserImage from "./UserImage";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";

const ChatBox = ({ chat, currentUserId, setSendMessage, receiveMessage }) => {
    const [userData, setUserData] = useState(null);
    const token = useSelector((state) => state.token);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scroll = useRef();

    useEffect(() => {
        if (receiveMessage !== null && receiveMessage.chatId === chat._id) {
            setMessages([...messages, receiveMessage]);
        }
    }, [receiveMessage])
    
    const getUserData = async () => {
        const userId = chat.members.find((id) => id !== currentUserId);
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUserData(data);
    };

    const getMessages = async () => {
        const response = await fetch(`http://localhost:3001/messages/${chat._id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setMessages(data);
    }

    useEffect(() => {
       if (chat !== null) getUserData();
    }, [chat, currentUserId]);

    useEffect(() => {
        if (chat !== null) getMessages();
    }, [chat]);

    const handleChange = (newMessage) => {
        setNewMessage(newMessage);
    }

    const handleSend = async (e) => {
        e.preventDefault();
        const message = {
            senderId: currentUserId,
            text: newMessage,
            chatId: chat._id,
        };
        const response = await fetch("http://localhost:3001/messages", {
            method: "POST",
            mode: 'cors',
            headers: { 
              Authorization: `Bearer ${token}`, 
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "chatId": chat._id,
                "senderId": currentUserId,
                "text": newMessage,
            }),
        });
        const data = await response.json();
        console.log(data);
        setMessages([...messages, data]);
        setNewMessage("");

        const receiverId = chat.members.find((id) => id !== currentUserId);
        setSendMessage({ ...message, receiverId });
    };

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])
      
    if (!userData) return null;
    
    return (
      <Box className="chatbox-container">
         <Box className="chat-header">
            <Box className="chat-person">
                <Box>
                    <UserImage image={userData.picturePath} size="30"/>
                    <Box>
                    <Typography style={{ fontSize: "1rem" }}>{userData.firstName} {userData.lastName}</Typography>
                    </Box>
                </Box>
            </Box>
         </Box>
         <Box className="chat-body">
           {messages.map((message) => (
             <Box ref={scroll} className={message.senderId === currentUserId ? "message own" : "message"}>
               <Typography>{message.text}</Typography>
               <Typography>{format(message.createdAt)}</Typography>
             </Box>
           ))}
         </Box>
         <Box className="chat-sender">
            <InputEmoji value={newMessage} onChange={handleChange} />
            <Button className="send-button button" onClick={handleSend}>Wyślij</Button>
         </Box>
      </Box>
  )
}

export default ChatBox;