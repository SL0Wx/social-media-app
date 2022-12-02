import { Box, Typography, InputBase, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Navbar from "scenes/navbar";
import Sidebar from "components/Sidebar";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MyFriend from "components/MyFriend";
import Friend from "components/Friend";
import CountUp from 'react-countup';
import Fuse from 'fuse.js';
import WidgetWrapper from "components/WidgetWrapper";

const ChatsPage = () => {
    const [user, setUser] = useState(null);
    const theme = useTheme();
    const alt = theme.palette.background.alt;
    const mode = (useTheme().palette.mode === 'dark');
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.user.friends);
    const { _id } = useSelector((state) => state.user);
    const [friendResults, setFriendResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isChat, setIsChat] = useState(false);

    const getUser = async () => {
      const response = await fetch(`http://localhost:3001/users/${_id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    };

    useEffect(() => {
      getUser();
    }, [])

    if (!user) return null;

    return (
        <Box>
            <Sidebar />
            <Navbar />
            <FlexBetween style={{ justifyContent: "space-around", margin: "0 0 0 100px"}}>
                <Box className="chatWidget" backgroundColor={alt}>
                    <FlexBetween>
                      <Box className="chatHeaderLeft" flexBasis="30%" backgroundColor="#849FFF">
                        <Typography fontSize="1.5rem" fontWeight="bold">ZNAJOMI</Typography>
                      </Box>
                      <Box className="chatHeaderRight" flexBasis="70%" backgroundColor={theme.palette.primary.main}>
                        <Typography fontSize="1.5rem" fontWeight="bold">CZATY</Typography>
                      </Box>
                    </FlexBetween>
                    <FlexBetween>
                      <Box className="chatMainLeft" flexBasis="30%" backgroundColor={theme.palette.background.alt}>
                      <Box display="flex" gap="1.5rem 0" flexWrap="wrap" justifyContent="flex-start" width="100%">
                        {friends.map((friend) => (
                            <Box flex="0 0 50%" key={friend._id} borderColor={theme.palette.primary.main} >
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
                      <Box className="chatMainRight" flexBasis="70%" backgroundColor={theme.palette.neutral.light}>
                      </Box>
                    </FlexBetween>
                </Box>
            </FlexBetween>
        </Box>
    )
}

export default ChatsPage;