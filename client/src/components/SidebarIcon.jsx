import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { Box, useMediaQuery, useTheme } from "@mui/material";

function SidebarIcon({ src, title, route }) {
    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const theme = useTheme();

    return (
        <Box className={styles.sidebar_icon_wrapper} sx={{ "&:hover": { background: theme.palette.background.hover } }} onClick={() => {
            navigate(route);
            navigate(0);
          }}>
            <img className={styles.sidebar_icon} src={src} alt="profile" />
            <p className={styles.sidebar_label}>{title}</p>
        </Box>
    )
}

export default SidebarIcon;