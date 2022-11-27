import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import MyFriend from "components/MyFriend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FriendListWidget = ({ userId, pageType }) => {
    const dispatch = useDispatch();
    const { palette }= useTheme();
    const token = useSelector((state) => state.token);
    const { _id } = useSelector((state) => state.user);
    const friends = useSelector((state) => state.user.friends);
    const theme = useTheme();

    const getFriends = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}/friends`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setFriends({ friends: data }));
    };

    useEffect(() => {
        getFriends();
    }, []);

    return (
        <WidgetWrapper >
            {pageType !== "friends" ? (
                <>
                    <Typography color={palette.neutral.dark} variant="h5" fontWeight="500" sx={{ mb: "1.5rem"}}>
                        Znajomi
                    </Typography>
                    <Box display="flex" flexDirection="column" gap="1.5rem">
                        {friends.map((friend) => (
                            _id !== userId ? (
                                <Friend 
                                    key={friend._id}
                                    friendId={friend._id}
                                    name={`${friend.firstName} ${friend.lastName}`}
                                    subtitle={friend.location}
                                    userPicturePath={friend.picturePath}
                                />
                            ) : (
                                <MyFriend 
                                    key={friend._id}
                                    friendId={friend._id}
                                    name={`${friend.firstName} ${friend.lastName}`}
                                    subtitle={friend.location}
                                    userPicturePath={friend.picturePath}
                                />
                            )
                        ))}
                    </Box>
                </>
                ) : (
                    <Box display="flex" gap="1.5rem 0" flexWrap="wrap" justifyContent="space-evenly" width="100%">
                        {friends.map((friend) => (
                            <Box flex="0 0 45%" border="3px solid" padding="10px 15px" key={friend._id} borderColor={theme.palette.primary.main}  borderRadius="4rem">
                                <MyFriend 
                                    key={friend._id}
                                    friendId={friend._id}
                                    name={`${friend.firstName} ${friend.lastName}`}
                                    subtitle={friend.location}
                                    userPicturePath={friend.picturePath}
                                />
                            </Box>
                        ))}
                    </Box>
                )}
        </WidgetWrapper>
    )
}

export default FriendListWidget;