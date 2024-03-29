import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
} from "@mui/icons-material";
import { Box, Divider, Typography, InputBase, useTheme, Button, IconButton, useMediaQuery } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGroupPosts } from "state";

const MyGroupPostWidget = ({ groupId, userPicturePath }) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    const handleGroupPost = async () => {
        const formData = new FormData();
        formData.append("userId", _id);
        formData.append("groupId", groupId);
        formData.append("description", post);
        if (image) {
            formData.append("picture", image);
            formData.append("picturePath", image.name);
        }

        const response = await fetch(`http://localhost:3001/groupPosts/create`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const groupPosts = await response.json();
        dispatch(setGroupPosts({ groupPosts }));
        setImage(null);
        setPost("");
    };

    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={userPicturePath} />
                <InputBase placeholder="Czym chciałbyś się podzielić?" onChange={(e) => setPost(e.target.value)} value={post}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem"
                    }} />
            </FlexBetween>
            {isImage && (
                <Box borderRadius="5px" border={`1px solid ${medium}`} mt="1rem" p="1rem">
                    <Dropzone acceptedFiles=".jpg,.jpeg,.png" multiple={false} 
                        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <FlexBetween>
                                <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p="1rem" width="100%" sx={{ "&:hover": { cursor: "pointer" } }}>
                                    <input {...getInputProps()} />
                                        {!image ? (
                                            <p>Dodaj zdjęcie</p>
                                        ) : (
                                            <FlexBetween>
                                                <Typography>{image.name}</Typography>
                                                <EditOutlined />
                                            </FlexBetween>
                                        )}
                                </Box>
                                {image && (
                                    <IconButton onClick={() => setImage(null)} sx={{ width: "15%" }}>
                                        <DeleteOutlined />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        )}
                    </Dropzone>
                </Box>
            )}

            <Divider sx={{ margin: "1.25rem 0"}} />

            <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography color={palette.primary.dark} sx={{ "&:hover": { cursor: "pointer", color: palette.primary.dark } }}>Zdjęcie</Typography>
                </FlexBetween>
                <Button disabled={!post} onClick={handleGroupPost}
                    sx={{
                        color: palette.primary.dark, 
                        backgroundColor: palette.primary.main, 
                        borderRadius: "3rem",
                        padding: "5px 15px",
                        "&:hover": { color: palette.primary.main }
                    }}>
                    Wyślij na orbitę
                </Button>
            </FlexBetween>
        </WidgetWrapper>
    );
};

export default MyGroupPostWidget;