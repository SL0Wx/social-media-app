import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const MyFriend = ({ friendId, name, subtitle, userPicturePath}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isMyFriend = friends.find((friend) => friend._id === _id);
  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
    window.location.reload();
  };

  return (
    <FlexBetween>
      {name !== undefined && subtitle !== undefined && subtitle !== "CHAT" && userPicturePath !== undefined ? (
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box>
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.main,
                cursor: "pointer",
              },
            }}
            onClick={() => {
              navigate(`/profile/${friendId}`);
              navigate(0);
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      ) : null}
      {_id !== friendId && subtitle !== "CHAT" ? (
        <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isMyFriend || isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
      ) : null}
      {subtitle === "CHAT" ? (
         <FlexBetween gap="1rem" justifyContent="flex-start !important">
         <Box border="3px solid" borderColor={palette.primary.main} borderRadius="10rem">
           <UserImage image={userPicturePath} size="40px" />
         </Box>
         <Box>
           <Typography
             color={main}
             variant="h5"
             fontWeight="500"
             sx={{
               "&:hover": {
                 color: palette.primary.main,
                 cursor: "pointer",
               },
             }}
             onClick={() => {
               navigate(`/profile/${friendId}`);
               navigate(0);
             }}
           >
             {name}
           </Typography>
         </Box>
       </FlexBetween>
      ) : null}
    </FlexBetween>
  );
};

export default MyFriend;