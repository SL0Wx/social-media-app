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
            <Box ml="6rem" width={isNonMobileScreens ? "92%" : "85%"} padding="2rem 6%" display={isNonMobileScreens ? "flex" : "block"} gap="0.5rem" justifyContent="space-around">
                <Box flexBasis={isNonMobileScreens ? "50%" : undefined} mt={isNonMobileScreens ? undefined : "2rem"}>
                    <MyPostWidget picturePath={picturePath} />
                    <PostsWidget userId={_id} />
                </Box>
            </Box>
        </Box>
    );
};

export default HomePage;