import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  DarkMode,
  LightMode,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import Fuse from 'fuse.js';

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [userResults, setUserResults] = useState([]);
  const [groupResults, setGroupResults] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const token = useSelector((state) => state.token);

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const alt = theme.palette.background.alt;
  const mode = (useTheme().palette.mode === 'dark');

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleOnSearch = async({ currentTarget = {} }) => {
      const { value } = currentTarget;
      const searchQuery = value;
      if (searchQuery !== "") {
        const responseUser = await fetch(`http://localhost:3001/users/user/${searchQuery}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
      const dataUser = await responseUser.json();
      const fuseUser = new Fuse(dataUser, {
        keys: [
          'firstName',
          'lastName'
        ]
      });

      const resultsUser = fuseUser.search(searchQuery, {limit: 3});
      setUserResults(searchQuery ? resultsUser.map(result => result.item) : "");
      
      const responseGroup = await fetch("http://localhost:3001/groups", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
      const dataGroup = await responseGroup.json();
      const fuseGroup = new Fuse(dataGroup, {
        keys: [
          'groupName'
        ],
      });
      
      const resultsGroup = fuseGroup.search(searchQuery, {limit: 3});
      setGroupResults(searchQuery ? resultsGroup.map(result => result.item) : "");
      } else {
        setUserResults([]);
        setGroupResults([]);
      }
  }

  return (
    <FlexBetween marginLeft="96px" padding="1.3rem 3% 1.1rem 20px" backgroundColor={alt} position="sticky" top="0" zIndex="100">
      <FlexBetween gap="2rem">
        <img className="homeLogo" src="/assets/sfera_txt_icon.svg" alt="home"  onClick={() => navigate("/home")}/>
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="25px"
            gap="3rem"
            padding="0.1rem 0.25rem 0.1rem 1.5rem"
          >
            <InputBase placeholder="Wyszukaj..." onChange={handleOnSearch} />
            <IconButton>
              <Search />
            </IconButton>
            <ul className="SearchList">
              {userResults.length > 0 ? userResults.map(searchUser => {
                const {_id, picturePath, firstName, lastName } = searchUser;
                return (
                  <li className="SearchItem" style={{ backgroundColor: mode ? "black" : "white"}} key={_id}  onClick={() => {
                    navigate(`/profile/${_id}`);
                    navigate(0);
                  }}>
                    <UserImage image={picturePath} size="30px"/> 
                    {firstName} {lastName} {_id === user._id ? "(Ty)" : null}
                  </li>
                )
              }) : ""}
            </ul>
            <ul className="SearchList">
              {groupResults.length > 0 ? groupResults.map(searchGroup => {
                const { _id, picturePath, groupName } = searchGroup;
                return (
                  <li className="SearchItem" style={{ backgroundColor: mode ? "black" : "white"}} key={_id}  onClick={() => {
                    navigate(`/group/${_id}`);
                    navigate(0);
                  }}>
                    <UserImage image={picturePath} size="30px"/> 
                    {groupName}
                  </li>
                )
              }) : ""}
            </ul>
          </FlexBetween>
        )}
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "auto",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Wyloguj się</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Wyloguj się
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;