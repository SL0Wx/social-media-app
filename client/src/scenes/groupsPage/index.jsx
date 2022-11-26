import { Box, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "scenes/navbar";
import Sidebar from "components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Form from "./Form";
import GroupListWidget from "scenes/widgets/GroupListWidget";

const GroupsPage = () => {
    const navigate = useNavigate();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    return (
        <Box>
            <Sidebar />
            <Navbar />
            <Form />
            <GroupListWidget userId={_id} />
        </Box>
    )
}

export default GroupsPage;