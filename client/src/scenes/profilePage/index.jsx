import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import Sidebar from "components/Sidebar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import UserWidget from "scenes/widgets/UserWidget";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const { userId } = useParams();
    const { _id, picturePath } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

    const getUser = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
      };

    useEffect(() => {
        getUser();
    }, []);

    if (!user) return null;

    return (
        <Box>
            <Sidebar />
            <Navbar />
            <Box width={isNonMobileScreens ? "100%" : "85%"} padding="2rem 6%" display={isNonMobileScreens ? "flex" : "block"} gap="2rem" justifyContent="center" margin="0 0 0 100px" >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <UserWidget userId={userId} picturePath={user.picturePath} />
                    <Box m="2rem 0" />
                    <FriendListWidget userId={userId} />
                </Box>
                <Box flexBasis={isNonMobileScreens ? "42%" : undefined} marginTop={isNonMobileScreens ? "-2rem" : "0"}>
                    {_id === userId && (
                        <Box flexBasis={isNonMobileScreens ? "42%" : undefined} marginTop="2rem">
                            <MyPostWidget picturePath={picturePath} pageType="profile" />
                        </Box>
                    )}
                    <PostsWidget userId={userId} isProfile />
                </Box>
                {isNonMobileScreens && <Box flexBasis="26%"></Box>}
            </Box>
        </Box>
    )
};

export default ProfilePage;