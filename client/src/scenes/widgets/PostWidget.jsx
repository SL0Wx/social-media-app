import {
    ChatBubbleOutlineOutlined,
    ThumbUpOutlined,
    ThumbUp,
    ShareOutlined,
  } from "@mui/icons-material";
  import { Box, Divider, IconButton, Typography, useTheme, InputBase, Button, setRef } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import Friend from "components/Friend";
  import WidgetWrapper from "components/WidgetWrapper";
  import UserImage from "components/UserImage";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPost, setPostComments } from "state";
  import { format } from 'date-fns';
import { useEffect } from "react";
  
  const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    picturePath,
    userPicturePath,
    likes,
    comments,
    createdAt,
  }) => {
    const [isComments, setIsComments] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [commentText, setCommentText] = useState("");
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const postComments = useSelector((state) => state.postComments);
    const user = useSelector((state) => state.user);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  
    const patchLike = async () => {
      const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    };

    const patchComment = async () => {
      const responseCreateComment = await fetch(`http://localhost:3001/posts/${postId}/${user._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "text": commentText }),
      });

      const comment = await responseCreateComment.json();
      const response = await fetch(`http://localhost:3001/posts/${postId}/${comment._id}/comment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setRefresh(refresh + 1);
    };

    const getComments = async () => {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      dispatch(setPostComments({ postComments: data }));
      console.log(postComments);
    }

    useEffect(() => {
      getComments();
    }, []);
  
    return (
      <WidgetWrapper m="2rem 0">
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={format(new Date(createdAt), 'dd.MM.yyyy ● HH:mm')}
          userPicturePath={userPicturePath}
        />
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
  
  export default PostWidget;