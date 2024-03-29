import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage";
import ProfilePage from "./scenes/profilePage";
import FriendsPage from "./scenes/friendsPage";
import GroupsPage from "./scenes/groupsPage";
import GroupPage from "./scenes/groupPage";
import ChatsPage from "./scenes/chatsPage";
import GalleryPage from "scenes/galleryPage";
import { useMemo} from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() {  
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/friendsPage" element={isAuth ? <FriendsPage /> : <Navigate to="/" />} />
            <Route path="/groupsPage" element={isAuth ? <GroupsPage /> : <Navigate to="/" />} />
            <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="/group/:groupId" element={isAuth ? <GroupPage /> : <Navigate to="/" />} />
            <Route path="/chatsPage" element={isAuth ? <ChatsPage /> : <Navigate to="/" />} />
            <Route path="/galleryPage" element={isAuth ? <GalleryPage /> : <Navigate to="/" /> } />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;