import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
    document.getElementsByTagName("body")[0].style.overflowY = "hidden";
    return (
        <Box overflow="hidden">
            <Form />
        </Box>
    );
};

export default LoginPage;