import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({ friendId, name, subtitle, userPicturePath, pageType }) => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const token = useSelector((state) => state.token);
  const [friend, setFriend] = useState(null);
  const [isChat, setIsChat] = useState(false);

  const getFriend = async () => {
    const response = await fetch(`http://localhost:3001/users/${friendId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setFriend(data);
  };

  useEffect(() => {
    getFriend();
  }, [])

  return (
    <FlexBetween>
      {pageType === "chats" ? (
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
      ) : (
        <FlexBetween gap="1rem" onClick={() => {
          setIsChat(true);
        }} style={{ cursor: "pointer" }}>
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
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      )}
    </FlexBetween>
  );
};

export default Friend;