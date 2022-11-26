import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import Sidebar from "components/Sidebar";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget"

const HomePage = () => {
    document.getElementsByTagName("body")[0].style.overflowY = "scroll";
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const { _id, picturePath } = useSelector((state) => state.user);

    return (
        <Box>
            <Sidebar />
            <Navbar />
            <Box margin="0 100px" width={isNonMobileScreens ? "90%" : "75%"} padding="2rem 6%" display={isNonMobileScreens ? "flex" : "block"} gap="0.5rem" justifyContent="space-around">
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <UserWidget userId={_id} />
                </Box>
                <Box flexBasis={isNonMobileScreens ? "42%" : undefined} mt={isNonMobileScreens ? undefined : "2rem"}>
                    <MyPostWidget picturePath={picturePath} />
                    <PostsWidget userId={_id} />
                </Box>
                {isNonMobileScreens && <Box flexBasis="26%">
                    <FriendListWidget userId={_id} pageType="home"/>
                </Box>}
            </Box>
        </Box>
    );
};

export default HomePage;