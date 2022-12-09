import {
    ChatBubbleOutlineOutlined,
    ThumbUpOutlined,
    ThumbUp,
    ShareOutlined,
  } from "@mui/icons-material";
  import { Box, Divider, IconButton, Typography, useTheme, InputBase, Button } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
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
    const [commentText, setCommentText] = useState("");
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
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

    const patchComment = async () => {
      const response = await fetch(`http://localhost:3001/groupPosts/${postId}/comment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          "userId": loggedInUserId,
          "firstName": user.firstName,
          "lastName": user.lastName,
          "picturePath": user.picturePath,
          "text": commentText,
        }),
      });
      const updatedGroupPost = await response.json();
      dispatch(setGroupPost({ groupPost: updatedGroupPost }));
      setCommentText("");
    }
  
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
            <FlexBetween gap="1.5rem">
              <UserImage image={user.picturePath} size={40} />
              <InputBase placeholder="Napisz komentarz" onChange={(e) => setCommentText(e.target.value)} value={commentText}
                  sx={{
                      width: "100%",
                      backgroundColor: palette.neutral.light,
                      borderRadius: "2rem",
                      padding: "0.5rem 1rem",
                      margin: "1rem"
                  }} />
              <Button disabled={!commentText} onClick={patchComment}
                    sx={{
                        color: palette.primary.dark, 
                        backgroundColor: palette.primary.main, 
                        borderRadius: "3rem",
                        padding: "0.5rem 1rem",
                        "&:hover": { color: palette.primary.main }
                    }}>
                    Wyślij
                </Button>
            </FlexBetween>
            {comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <FlexBetween padding="0.5rem" flexDirection="row !important" justifyContent="flex-start !important">
                  <Box height="100%" display="flex" alignItems="center" >
                    <UserImage image={comment.picturePath} size={30} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: palette.neutral.dark, mt: "0.5rem", pl: "1rem", "&:hover": {
                          color: palette.primary.main,
                          cursor: "pointer"
                        } }} onClick={() => navigate(`/profile/${comment.userId}`)}>
                        {comment.firstName} {comment.lastName}
                    </Typography>
                    <Typography sx={{ color: main, mb: "0.5rem", pl: "1rem" }}>
                      {comment.text}
                    </Typography>
                  </Box>
                </FlexBetween>
              </Box>
            )).reverse()}
            <Divider />
          </Box>
        )}
      </WidgetWrapper>
    );
  };
  
  export default GroupPostWidget;