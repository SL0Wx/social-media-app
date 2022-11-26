import { Box, useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import Sidebar from "components/Sidebar";
import { useNavigate } from "react-router-dom";

const GroupsPage = () => {
    const navigate = useNavigate();

    return (
        <Box>
            <Sidebar />
            <Navbar />
        </Box>
    )
}

export default GroupsPage;