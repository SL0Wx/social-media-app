import { Box, Divider, Typography, InputBase, useTheme, Button, IconButton, useMediaQuery } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Navbar from "scenes/navbar";
import Sidebar from "components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MyFriend from "components/MyFriend";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import CountUp from 'react-countup';
import Fuse from 'fuse.js';
import Form from "./Form";
import GroupListWidget from "scenes/widgets/GroupListWidget";
import Group from "components/Group";

const GroupsPage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();
    const alt = theme.palette.background.alt;
    const mode = (useTheme().palette.mode === 'dark');
    const token = useSelector((state) => state.token);
    const { _id } = useSelector((state) => state.user);
    const [groupResults, setGroupResults] = useState([]);
    let members = [];

    const getUser = async () => {
      const response = await fetch(`http://localhost:3001/users/${_id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    };

    useEffect(() => {
      getUser();
    }, [])
    
    const handleOnSearch = async({ currentTarget = {} }) => {
      const { value } = currentTarget;
      const searchQuery = value;
      if (searchQuery !== "") {
        const responseGroup = await fetch("http://localhost:3001/groups", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
      const dataGroup = await responseGroup.json();
      const fuseGroup = new Fuse(dataGroup, {
        keys: [
          'groupName',
        ],
        threshold: 0.6
      });
      
      const resultsGroup = fuseGroup.search(searchQuery);
      setGroupResults(searchQuery ? resultsGroup.map(result => result.item) : null);
      } else {
      setGroupResults([]);
      }
    }

    return (
        <Box>
        <Sidebar />
        <Navbar />
        <FlexBetween style={{ justifyContent: "space-around", flexDirection: "column" }}>
            <Box className="fgWidget" backgroundColor={alt}>
                <Box className="fgHeader">
                    <Box className="fgSvg">
                      <svg width="100%" height="auto" length="auto" viewBox="0 0 772 286" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path id="header_shape" d="M385.108 284.095L16.5055 150.928C6.60029 147.35 0 137.947 0 127.416V25C0 11.1929 11.1929 0 25 0H746.732C760.539 0 771.732 11.1929 771.732 25V127.663C771.732 138.073 765.281 147.393 755.539 151.06L402.41 283.98C396.84 286.076 390.705 286.117 385.108 284.095Z" fill="#6486FF"/>
                      </svg>
                    </Box>
                    <Typography id="countHeader" fontSize="4rem" color={alt}>
                        GRUPY
                    </Typography>
                    <svg id="countCircle" width="194px" height="194px" length="auto" viewBox="0 0 194 194" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="countCircleIn">
                        <circle id="outside" cx="97.1202" cy="97.0351" r="84.0147" fill={theme.palette.primary.dark} stroke={alt} strokeWidth="25"/>
                        <circle id="inside" cx="97.5" cy="97.5" r="72.5" fill="#6284FF"/>
                      </g>
                    </svg>
                    <Typography id="countNumber" fontSize="3rem" color={alt}>
                      <CountUp start={0} end={1} duration={1.5} delay={0} />
                    </Typography>
                </Box>
                <Box className="fgSearch">
                    <Typography id="searchLabel" fontSize="2rem" color={theme.palette.primary.main}>
                      Wyszukaj grupy
                    </Typography>
                    <InputBase placeholder="Wyszukaj swojej grupy..." onChange={handleOnSearch}
                    sx={{
                      width: "70%",
                      backgroundColor: theme.palette.neutral.light,
                      borderRadius: "2rem",
                      padding: "0.25rem 2rem",
                      margin: "0 auto",
                    }} />
                </Box>
                <Box className="fgList">
                  <Box display="flex" gap="1.5rem 0" flexWrap="wrap" justifyContent="space-evenly" width="100%">
                  {groupResults.length > 0 ? groupResults.map(searchGroup => {
                    const {_id, picturePath, groupName,founderId, members, topic } = searchGroup;
                     return (
                        <>
                        <Box flex="0 0 80%" border="3px solid" padding="10px 15px" borderColor={theme.palette.primary.main} key={_id} borderRadius="4rem">
                        <Group 
                          groupId={_id} 
                          groupName={groupName} 
                          picturePath={picturePath} 
                          founderId={founderId} 
                          members={members} 
                          topic={topic} />
                        </Box>
                        </>
                     )
                  }) : <GroupListWidget userId={_id} pageType="groups" /> }
                  </Box>
                </Box>
            </Box>
            <Form />
        </FlexBetween>
    </Box>
    )
}

export default GroupsPage;