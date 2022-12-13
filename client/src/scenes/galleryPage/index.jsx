import { Box, Typography, InputBase, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Navbar from "scenes/navbar";
import Sidebar from "components/Sidebar";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MyFriend from "components/MyFriend";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import CountUp from 'react-countup';
import Fuse from 'fuse.js';
import WidgetWrapper from "components/WidgetWrapper";
import GalleryWidget from "scenes/widgets/GalleryWidget";

const GalleryPage = () => {
    const theme = useTheme();
    const alt = theme.palette.background.alt;
    const mode = (useTheme().palette.mode === 'dark');
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);

    return (
        <Box>
            <Sidebar selected="gallery"/>
            <Navbar />
            <FlexBetween style={{ justifyContent: "space-around", margin: "0 0 0 100px"}}>
                <Box className="galleryWidget" backgroundColor={alt}>
                    <Box className="galleryHeader">
                        <Typography style={{ fontSize: "3rem", fontWeight: "700", color: theme.palette.primary.main }}>Galeria</Typography>
                    </Box>
                    <Box className="galleryList">
                      <GalleryWidget userId={user._id} />
                    </Box>
                </Box>
            </FlexBetween>
        </Box>
    )
}

export default GalleryPage