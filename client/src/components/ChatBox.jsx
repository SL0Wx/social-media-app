import { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import { Box, Typography, InputBase, useTheme, Button } from "@mui/material";
import UserImage from "./UserImage";
import InputEmoji from "react-input-emoji";
import * as timeago from 'timeago.js';
import TimeAgo from 'timeago-react';
import pl from 'timeago.js/lib/lang/pl';

timeago.register('pl', pl)

const ChatBox = ({ chat, currentUserId, setSendMessage, receiveMessage }) => {
    const [userData, setUserData] = useState(null);
    const token = useSelector((state) => state.token);
    const theme = useTheme();
    const mode = (useTheme().palette.mode === 'dark');
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
       if (typeof e !== "string") e.preventDefault();
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
                "chatId": message.chatId,
                "senderId": currentUserId,
                "text": newMessage,
            }),
        });
        const data = await response.json();
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
         <Box className="chat-body">
           {messages.map((message) => (
             <Box display="flex" flexDirection="row" justifyContent={message.senderId === currentUserId ? "flex-end" : "flex-start"}>
               {message.senderId !== currentUserId && (
                 <Box alignSelf="flex-end" margin="0 -10px -15px 0" zIndex="1">
                 <UserImage image={userData.picturePath} size="25" />
                 </Box>
               )}
               <Box ref={scroll} gap="0" className={message.senderId === currentUserId ? "message own" : "message"} backgroundColor={message.senderId === currentUserId ? theme.palette.primary.main : theme.palette.background.alt}>
                 <Typography color={message.senderId === currentUserId || mode ? "white" : theme.palette.primary.main}>{message.text}</Typography>
                 <Typography textAlign={message.senderId === currentUserId ? "right" : "left"} fontSize="0.7rem" color={message.senderId === currentUserId || mode ? "white" : theme.palette.primary.main}><TimeAgo datetime={message.createdAt} locale='pl' /></Typography>
               </Box>
             </Box>
           ))}
         </Box>
         <Box className="chat-sender" backgroundColor={theme.palette.neutral.light} zIndex="2">
            <InputEmoji value={newMessage} onEnter={handleSend} onChange={handleChange} placeholder="Napisz wiadomość"/>
            <Button className="send-button button" onClick={handleSend}>Wyślij</Button>
         </Box>
      </Box>
  )
}

export default ChatBox;