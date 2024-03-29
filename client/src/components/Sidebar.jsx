import SidebarIcon from './SidebarIcon';
import styles from "./Sidebar.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Box, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Sidebar({ selected }) {
    const { _id } = useSelector((state) => state.user);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box backgroundColor={theme.palette.background.alt} className={isMenuOpen ? styles.app_sidebar_open : styles.app_sidebar_closed}>
            <div className={isMenuOpen ? styles.app_sidebar_logo_on : ""}>
                <img className={isMenuOpen ? styles.sidebar_menu_open : styles.sidebar_menu_closed} onClick={() => setIsMenuOpen((prev) => !prev)} src={isMenuOpen ? "/assets/menu_open_icon.svg" : "/assets/menu_closed_icon.svg"} alt="menu" />
                <img className={isMenuOpen ? styles.sidebar_logo_on : styles.sidebar_logo_off} src="/assets/sfera_txt_icon.svg" alt="logo" onClick={() => navigate("/home")}/>
            </div>
            <SidebarIcon src="/assets/explore_icon.svg" title="Eksploruj" route="/home" selectedIcon={selected === "explore"}/>
            <SidebarIcon src="/assets/profile_icon.svg" title="Profil" route={`/profile/${_id}`} selectedIcon={selected === "profile"}/>
            <SidebarIcon src="/assets/friends_icon.svg" title="Znajomi" route="/friendsPage" selectedIcon={selected === "friends"}/>
            <SidebarIcon src="/assets/groups_icon.svg" title="Grupy" route="/groupsPage" selectedIcon={selected === "groups"}/>
            <SidebarIcon src="/assets/chats_icon.svg" title="Czaty" route="/chatsPage" selectedIcon={selected === "chats"}/>
            <SidebarIcon src="/assets/gallery_icon.svg" title="Galeria" route="/galleryPage" selectedIcon={selected === "gallery"}/>
        </Box>
    )
}

export default Sidebar;