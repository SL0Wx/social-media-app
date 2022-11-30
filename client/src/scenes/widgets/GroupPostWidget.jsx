import {
    ChatBubbleOutlineOutlined,
    ThumbUpOutlined,
    ThumbUp,
    ShareOutlined,
  } from "@mui/icons-material";
  import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import Friend from "components/Friend";
  import MyFriend from "components/MyFriend";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import { setGroupPost } from "state";
  import { format } from 'date-fns';
  import UserImage from "components/UserImage";
  
  const GroupPostWidget = ({
    postId,
    postUserId,
    groupName,
    groupId,
    name,
    description,
    picturePath,
    groupPicturePath,
    likes,
    comments,
    createdAt,
  }) => {
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
    const navigate = useNavigate();
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  
    const patchLike = async () => {
      const response = await fetch(`http://localhost:3001/groupPosts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedGroupPost = await response.json();
      dispatch(setGroupPost({ groupPost: updatedGroupPost }));
    };
  
    return (
      <WidgetWrapper m="2rem 0">
        <FlexBetween width="10rem">
                <FlexBetween gap="1rem">
                    <UserImage image={groupPicturePath} size="55px"/>
                    <Box width="10rem">
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
                        navigate(`/group/${groupId}`);
                        navigate(0);
                        }}
                    >
                        {groupName}
                    </Typography>
                    <Typography color={palette.neutral.medium} fontSize="0.75rem" width="20rem">
                        {name} ● {format(new Date(createdAt), 'dd.MM.yyyy ● HH:mm')}
                    </Typography>
                  </Box>
                </FlexBetween>
        </FlexBetween>
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://localhost:3001/assets/${picturePath}`}
          />
        )}
        <FlexBetween mt="0.5rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <ThumbUp sx={{ color: primary }} />
                ) : (
                  <ThumbUpOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>
  
            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>
  
          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
        {isComments && (
          <Box mt="0.5rem">
            {comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment}
                </Typography>
              </Box>
            ))}
            <Divider />
          </Box>
        )}
      </WidgetWrapper>
    );
  };
  
  export default GroupPostWidget;