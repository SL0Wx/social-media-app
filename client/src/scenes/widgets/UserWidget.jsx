import { ManageAccountsOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import MyFriend from "components/MyFriend";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, pageType }) => {
    const [user, setUser] = useState(null);
    const { _id } = useSelector((state) => state.user);
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

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
    }, [])

    if (!user) return null;

    const {
        firstName,
        lastName,
        location,
        friends,
        picturePath,
    } = user;

    return (
        <WidgetWrapper>
            {/* FIRST ROW */}
            <FlexBetween gap="0.5rem" pb="1.1rem">
                <FlexBetween gap="1rem">
                    <UserImage image={picturePath} />
                    <Box>
                        <Typography variant="h4" color={dark} fontWeight="500"
                        sx={{
                            "&:hover": {
                                color: palette.primary.main,
                                cursor: "pointer"
                            }
                        }}
                        onClick={() => navigate(`/profile/${userId}`)}>
                            {firstName} {lastName}
                        </Typography>
                        {pageType !== "group" ? (
                            <Typography color={medium}>{friends.length} {friends.length > 1 ? "Znajomych" : (friends.length == 1 ? "Znajomy" : "Znajomych")}</Typography>
                        ) : (
                            <Typography color={medium}>{location}</Typography>
                        )}
                    </Box>
                </FlexBetween>
                {_id === userId && pageType !== "group" ? (
                    <ManageAccountsOutlined />
                ) : (
                    <MyFriend friendId={userId} />
                )}

            </FlexBetween>
                
            {pageType !== "group" ? (
                <>
                    {/* SECOND ROW */}
                    <Divider />

                    <Box p="1rem 0">
                        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                            <LocationOnOutlined fontSize="large" sx={{ color: main }} />
                            <Typography color={medium}>{location}</Typography>
                        </Box>
                    </Box>
                </>
            ) : null}
        </WidgetWrapper>
    );
};

export default UserWidget;