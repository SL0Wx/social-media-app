import { Box, Typography, InputBase, useTheme, useMediaQuery, IconButton, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { useSelector, useDispatch } from "react-redux";
import { setGallery } from "state";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, AddCircleOutline } from "@mui/icons-material";
import CountUp from 'react-countup';
import WidgetWrapper from "components/WidgetWrapper";
import Dropzone from "react-dropzone";

const GalleryWidget = ({ userId, pageType }) => {
    const [user, setUser] = useState(null);
    const [currentName, setCurrentName] = useState('');
    const [file, setFile] = useState(null);
    const [toggleSize, setToggleSize] = useState(false);
    const [isFile, setIsFile] = useState(false);
    const theme = useTheme();
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const alt = theme.palette.background.alt;
    const mode = (useTheme().palette.mode === 'dark');
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const gallery = useSelector((state) => state.gallery);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

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

    useEffect(() => {
        toggleSize ? 
        document.getElementsByTagName("body")[0].style.overflowY = "hidden" : 
        document.getElementsByTagName("body")[0].style.overflowY = "scroll";
    }, [toggleSize])

    return (
    <>
        {userId === _id ? (
            <Box className={pageType==="profile" ? null : "galleryBox"} backgroundColor={theme.palette.background.alt}> 
                {isFile && (
                    <Box borderRadius="5px" border={`1px solid ${medium}`} mb="1rem" p="1rem">
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
                <FlexBetween style={{ backgroundColor: theme.palette.primary.nav, padding: "1rem", borderRadius: "50px"}}>
                    <FlexBetween gap="0.25rem" onClick={() => setIsFile(!isFile)} sx={{ "&:hover": { cursor: "pointer" } }}>
                        <AddCircleOutline sx={{ color: mediumMain }} />
                        <Typography color={palette.primary.dark} sx={{ "&:hover": { color: palette.primary.dark } }}>Plik</Typography>
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
        ) : null}
        <Box>
            <Box className={pageType === "profile" ? "userGallery" : "gallery"}>
                <>
                    {gallery.length > 1 ? (
                        <>
                            {gallery.map((name) => (
                    <>
                    {name !== "" ? (
                    <>
                        {name.split('.').pop() === "mp4" || name.split('.').pop() === "avi" || name.split('.').pop() === "mkv" ? (
                            <Box className={toggleSize && name === currentName ? "imageOverlay" : null}>
                            <video id={isNonMobileScreens ? undefined : "galleryItem"} style={{ borderColor: theme.palette.primary.nav }} className={toggleSize && name === currentName ? "galleryVideoFull" : pageType === "profile" ? "userGalleryVideo" : "galleryVideo"} controls controlsList="nodownload noplaybackrate" disablePictureInPicture onClick={() => {setToggleSize(!toggleSize); setCurrentName(name)}}>
                                <source src={`http://localhost:3001/assets/${name}`}></source>
                            </video>
                            </Box>
                        ) : (name.split('.').pop() === "jpg" || name.split('.').pop() === "jpeg" || name.split('.').pop() === "png") ? (
                            <Box className={toggleSize && name === currentName ? "imageOverlay" : null}>
                                <img id={isNonMobileScreens ? undefined : "galleryItem"} style={{ borderColor: theme.palette.primary.nav }} className={toggleSize && name === currentName ? "galleryImageFull" : pageType === "profile" ? "userGalleryImage" : "galleryImage"} src={`http://localhost:3001/assets/${name}`} onClick={() => {setToggleSize(!toggleSize); setCurrentName(name)}}/>
                            </Box>
                        ) : (name.split('.').pop() === "mp3" || name.split('.').pop() === "wav" || name.split('.').pop() === "ogg") ? (
                            <audio id={isNonMobileScreens ? undefined : "galleryItemAudio"} style={{ borderColor: theme.palette.primary.nav }} className={pageType === "profile" ? "userGalleryAudio" : "galleryAudio"} controls controlsList="nodownload noplaybackrate">
                                <source src={`http://localhost:3001/assets/${name}`}></source>
                            </audio>
                        ) : null    
                        }
                        </>
                        ) : (
                        <></>
                        )}       
                        </>
                        ))}
                    </>
                    ) : (
                       <Box backgroundColor={theme.palette.background.hover} width="100%" padding="2rem 1rem" borderRadius="10px" mr="15px">
                        <FlexBetween gap="1.5rem">
                            <Typography>Nie ma tu jeszcze żadnych multimediów :/</Typography>
                        </FlexBetween>
                       </Box>
                    )}
                </>
            </Box>
        </Box>
    </>
  )
}

export default GalleryWidget