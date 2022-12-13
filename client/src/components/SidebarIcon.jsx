import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { Box, useMediaQuery, useTheme } from "@mui/material";

function SidebarIcon({ src, title, route, selectedIcon }) {
    console.log(selectedIcon);
    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const theme = useTheme();

    return (
        <Box className={!selectedIcon ? styles.sidebar_icon_wrapper : styles.sidebar_icon_selected} sx={{ background: (!selectedIcon ? theme.palette.background.alt : theme.palette.background.default), "&:hover": { background: theme.palette.background.hover } }} onClick={() => {
            navigate(route);
            navigate(0);
          }}>
            <img className={styles.sidebar_icon} src={src} alt="profile" />
            <p className={styles.sidebar_label}>{title}</p>
        </Box>
    )
}

export default SidebarIcon;