import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, InputBase, useTheme } from "@mui/material";
import UserImage from "./UserImage";

const Conversation = ({chatData, currentUserId, online}) => {
  const [userData, setUserData] = useState(null);
  const token = useSelector((state) => state.token);
  const theme = useTheme();
  
  const getUserData = async () => {
    const userId = chatData.members.find((id) => id !== currentUserId);
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUserData(data);
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (!userData) return null;

  return (
    <Box className="friend-conversation"  sx={{ "&:hover": { background: theme.palette.background.alt} }}>
      <Box className="conversation-wrap">
        {online && <Box className="online-dot"></Box>}
        <UserImage image={userData.picturePath} size="70"/>
        <Box>
          <Typography style={{ fontSize: "1.25rem" }}>{userData.firstName} {userData.lastName}</Typography>
          <Typography style={{ fontSize: "0.85rem" }}>{online ? "Online" : "Offline"}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Conversation;
