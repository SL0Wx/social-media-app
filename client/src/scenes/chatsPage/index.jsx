import { Box, Typography, InputBase, useTheme, IconButton } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Navbar from "scenes/navbar";
import Sidebar from "components/Sidebar";
import Conversation from "components/Conversation";
import { useSelector, useDispatch } from "react-redux";
import { setChats } from "state";
import { useEffect, useState, useRef } from "react";
import MyFriend from "components/MyFriend";
import ChatBox from "components/ChatBox";
import Friend from "components/Friend";
import Fuse from 'fuse.js';
import WidgetWrapper from "components/WidgetWrapper";
import UserImage from "components/UserImage";
import { ArrowBack } from "@mui/icons-material";
import { io } from "socket.io-client";

const ChatsPage = () => {
    const [user, setUser] = useState(null);
    const chats = useSelector((state) => state.chats);
    const dispatch = useDispatch();
    const theme = useTheme();
    const alt = theme.palette.background.alt;
    const mode = (useTheme().palette.mode === 'dark');
    const token = useSelector((state) => state.token);
    const { _id } = useSelector((state) => state.user);
    const [isChat, setIsChat] = useState(false);
    const [friends, setFriends] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sendMessage, setSendMessage] = useState(null);
    const [receiveMessage, setReceiveMessage] = useState(null);
    const [currentFriend, setCurrentFriend] = useState(null);
    const [friend, setFriend] = useState(null);
    
    const socket = useRef();

    useEffect(() => {
      if (sendMessage !== null) {
        socket.current.emit("send-message", sendMessage);
      }
    }, [sendMessage]);

    const getChats = async () => {
      try {
        const response = await fetch(`http://localhost:3001/chats/${_id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setChats({ chats: data }));
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      socket.current = io("http://localhost:8800");
      socket.current.emit("new-user-add", _id);
      socket.current.on("get-users", (users) => {
        setOnlineUsers(users);
      });
      getChats();
    }, [user]);

    useEffect(() => {
      socket.current.on("receive-message", (data) => {
        setReceiveMessage(data);
      })
    }, []);

    const getUser = async () => {
      const response = await fetch(`http://localhost:3001/users/${_id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    };

    const getUserFriends = async () => {
      const response = await fetch(`http://localhost:3001/users/${_id}/friends`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setFriends(data);
    }
    
    const getCurrentFriend = async () => {
      const current = friends.find((friend) => friend._id === currentFriend);
      current !== undefined && current !== null ? setFriend(current) : setFriend(null);
    }

    useEffect(() => {
      getUser();
      getUserFriends();
    }, [])

    useEffect(() => {
      getCurrentFriend();
    }, [currentFriend])

    if (!user) return null;
    if (!friends) return null;
    if (!chats) return null;
 
    const createChat = async ({ friendId }) => {
      
      const response = await fetch(`http://localhost:3001/chats/find/${user._id}/${friendId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data === null) {
        const response = await fetch(`http://localhost:3001/chats/create/${user._id}/${friendId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setChats({ chats: [...chats, data] }));
        setIsChat(false);
      } else {
        setCurrentChat(data);
      }
    }

    const checkOnlineStatus = (chat) => {
      const chatMember = chat.members.find((member) => member !== user._id);
      const online = onlineUsers.find((user) => user.userId === chatMember);
      return online ? true : false;
    }

    return (
        <Box>
            <Sidebar selected="chats"/>
            <Navbar />
            <FlexBetween style={{ justifyContent: "space-around", margin: "0 0 0 100px"}}>
                <Box className="chatWidget" backgroundColor={alt}>
                    {!isChat ? (
                      <FlexBetween>
                       <Box className="chatHeaderLeft" flexBasis="30%" backgroundColor="#849FFF">
                         <Typography fontSize="1.5rem" fontWeight="bold">ZNAJOMI</Typography>
                       </Box>
                       <Box className="chatHeaderRight" flexBasis="70%" backgroundColor={theme.palette.primary.main}>
                         <Typography fontSize="1.5rem" fontWeight="bold">CZATY</Typography>
                       </Box>
                     </FlexBetween>
                    ) : (
                      <Box className="chatHeaderRightOpen" flexBasis="100%" backgroundColor={theme.palette.primary.main}>
                         <Box display="flex" flexDirection="row" alignItems="center">
                           <IconButton onClick={() => {setCurrentChat(null); setIsChat(false); setCurrentFriend(null);}}>
                             <ArrowBack sx={{ height: "2.5rem", width: "2.5rem", color: "white"}}/>
                           </IconButton>
                           <Typography fontSize="1.5rem" fontWeight="bold">{friend !== undefined && friend !== null ? `${friend.firstName} ${friend.lastName}` : ""}</Typography>
                          </Box>
                          <Box border="3px solid" borderColor="white" borderRadius="10rem" width="56px" height="56px">
                            <UserImage image={friend !== undefined && friend !== null ? friend.picturePath : ""} size="50"/>
                          </Box>
                       </Box>
                    )}
                    <FlexBetween>
                      <Box className="chatMainLeft" flexBasis="30%" backgroundColor={theme.palette.background.alt}>
                        <Box display="flex" gap="1.5rem 0" flexWrap="wrap" justifyContent="flex-start" width="100%">
                          {friends.map((friend) => (
                              <Box className="chatFriendBox" flex="0 0 50%" key={friend._id} borderColor={theme.palette.primary.main} onClick={() => {
                                setIsChat(true);
                                createChat({ friendId: friend._id });
                                setCurrentFriend(friend._id);
                              }}>
                                  <MyFriend 
                                      key={friend._id}
                                      friendId={friend._id}
                                      name={`${friend.firstName} ${friend.lastName}`}
                                      subtitle={"CHAT"}
                                      userPicturePath={friend.picturePath}
                                  />
                              </Box>
                          ))}
                        </Box>
                      </Box>
                      <Box className={isChat === false ? "chatMainRight" : "chatMainRightOpen"} flexBasis="70%" backgroundColor={theme.palette.neutral.light}>
                        {isChat === false ? (
                          <Box className="Chat-list">
                          {chats.map((chat) => (
                            <Box onClick={() => {
                              setCurrentChat(chat);
                              setIsChat(true);
                              setCurrentFriend(chat.members.find((member) => member !== _id));
                            }}>
                              <Conversation chatData={chat} currentUserId={user._id} online={checkOnlineStatus(chat)}/>
                            </Box>
                        ))}
                        </Box>) : (
                          <Box>
                            <ChatBox chat={currentChat} currentUserId={user._id} setSendMessage={setSendMessage} receiveMessage={receiveMessage} />
                          </Box>
                        )}
                      </Box>
                    </FlexBetween>
                </Box>
            </FlexBetween>
        </Box>
    )
}

export default ChatsPage;