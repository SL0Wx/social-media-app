import { Box, Typography, InputBase, useTheme, IconButton, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { useSelector, useDispatch } from "react-redux";
import { setGallery } from "state";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, AddCircleOutline } from "@mui/icons-material";
import CountUp from 'react-countup';
import WidgetWrapper from "components/WidgetWrapper";
import Dropzone from "react-dropzone";

const GalleryWidget = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [isFile, setIsFile] = useState(false);
    const theme = useTheme();
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const alt = theme.palette.background.alt;
    const mode = (useTheme().palette.mode === 'dark');
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
    const token = useSelector((state) => state.token);
    const gallery = useSelector((state) => state.gallery);

    const getUser = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
        dispatch(setGallery({ gallery: data.gallery }));
    };

    const handleGallery = async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);

        const response = await fetch(`http://localhost:3001/users/${userId}/gallery`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const updatedUser = await response.json();
        dispatch(setGallery({ gallery: updatedUser.gallery }));
        setFile(null);
        setIsFile(false);
    }
  
    useEffect(() => {
        getUser();
    }, []);

    return (
    <Box>
        <Box>
            {gallery.map((name) => (
                <Typography>{name}</Typography>
            ))}
        </Box>
        {isFile && (
            <Box borderRadius="5px" border={`1px solid ${medium}`} mt="1rem" p="1rem">
                <Dropzone acceptedFiles=".jpg,.jpeg,.png,.mp4,.avi,.mkv,.mp3,.wav,.ogg" multiple={false} 
                    onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
                >
                    {({ getRootProps, getInputProps }) => (
                        <FlexBetween>
                            <Box {...getRootProps()} border={`2px dashed ${theme.palette.primary.main}`} p="1rem" width="100%" sx={{ "&:hover": { cursor: "pointer" } }}>
                                <input {...getInputProps()} />
                                    {!file ? (
                                        <p>Dodaj do galerii</p>
                                    ) : (
                                        <FlexBetween>
                                            <Typography>{file.name}</Typography>
                                            <EditOutlined />
                                        </FlexBetween>
                                    )}
                            </Box>
                            {file && (
                                <IconButton onClick={() => setFile(null)} sx={{ width: "15%" }}>
                                    <DeleteOutlined />
                                </IconButton>
                            )}
                        </FlexBetween>
                    )}
                </Dropzone>
            </Box>
        )}
        <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => setIsFile(!isFile)}>
                    <AddCircleOutline sx={{ color: mediumMain }} />
                    <Typography color={palette.primary.dark} sx={{ "&:hover": { cursor: "pointer", color: palette.primary.dark } }}>Plik</Typography>
                </FlexBetween>
                <Button disabled={!file} onClick={handleGallery}
                    sx={{
                        color: palette.primary.dark, 
                        backgroundColor: palette.primary.main, 
                        borderRadius: "3rem",
                        padding: "5px 15px",
                        "&:hover": { color: palette.primary.main }
                    }}>
                    Dodaj
                </Button>
            </FlexBetween>
    </Box>
  )
}

export default GalleryWidget