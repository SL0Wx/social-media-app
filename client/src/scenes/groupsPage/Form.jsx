import { useState, useRef } from "react";
import { Box, Button, TextField, useMediaQuery, Typography, useTheme, InputBase, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import * as yup from "yup";
import WidgetWrapper from "components/WidgetWrapper";

import { DeleteOutlined, ImageOutlined, MoreHorizOutlined, EditOutlined } from "@mui/icons-material";
import UserImage from "components/UserImage";
import { setGroups } from "state";

const groupSchema = yup.object().shape({
    groupName: yup.string().required("Pole wymagane"),
    picture: yup.string().required("Pole wymagane"),
    topic: yup.string().required("Pole wymagane"),
});

const initialValuesGroup = {
    groupName: "",
    picture: "",
    topic: "",
};

const Form = () => {
    const [isHovered, setIsHovered] = useState(false);
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const formikRef = useRef();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [groupName, setGroupName] = useState("");
    const [topic, setTopic] = useState("");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

   const handleGroup = async () => {
        const formData = new FormData();
        formData.append("groupName", groupName);
        formData.append("founderId", _id);
        formData.append("topic", topic);
        formData.append("picture", image);
        formData.append("picturePath", image.name);

        const response = await fetch(`http://localhost:3001/groups/create`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const groups = await response.json();
        dispatch(setGroups({ groups }));
        setImage(null);
        setGroupName("");
        setTopic("");
    }; 
    
    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <InputBase placeholder="Nazwa grupy" onChange={(e) => setGroupName(e.target.value)} value={groupName}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem"
                    }} />
                    <InputBase placeholder="Tematyka" onChange={(e) => setTopic(e.target.value)} value={topic}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem"
                    }} />
            </FlexBetween>
                <Box borderRadius="5px" border={`1px solid ${medium}`} mt="1rem" p="1rem">
                    <Dropzone acceptedFiles=".jpg,.jpeg,.png" multiple={false} 
                        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <FlexBetween>
                                <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p="1rem" width="100%" sx={{ "&:hover": { cursor: "pointer" } }}>
                                    <input {...getInputProps()} />
                                        {!image ? (
                                            <p>Dodaj zdjęcie grupy</p>
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
            <FlexBetween>
                <Button disabled={!groupName && !isImage} onClick={handleGroup}
                    sx={{
                        color: palette.primary.dark, 
                        backgroundColor: palette.primary.main, 
                        borderRadius: "3rem",
                        padding: "5px 15px",
                        "&:hover": { color: palette.primary.main }
                    }}>
                    Stwórz grupę
                </Button>
            </FlexBetween>
        </WidgetWrapper>
    )
}

export default Form;