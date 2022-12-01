import { Box, Typography, InputBase, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Navbar from "scenes/navbar";
import Sidebar from "components/Sidebar";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Friend from "components/Friend";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import CountUp from 'react-countup';
import Fuse from 'fuse.js';
import WidgetWrapper from "components/WidgetWrapper";

const ChatsPage = () => {
    const [user, setUser] = useState(null);
    const theme = useTheme();
    const alt = theme.palette.background.alt;
    const mode = (useTheme().palette.mode === 'dark');
    const token = useSelector((state) => state.token);
    const { _id } = useSelector((state) => state.user);
    const [friendResults, setFriendResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

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

    if (!user) return null;

    const { friends } = user;
    
    const handleOnSearch = async({ currentTarget = {} }) => {
      const { value } = currentTarget;
      const searchQuery = value;
      if (searchQuery !== "") {
        setSearchQuery(searchQuery);
        const responseFriend = await fetch(`http://localhost:3001/users/user/${searchQuery}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
      const dataFriend = await responseFriend.json();
      const fuseFriend = new Fuse(dataFriend, {
        keys: [
          'firstName',
          'lastName'
        ],
        threshold: 0.6
      });

      const resultsFriend = fuseFriend.search(searchQuery);
      setFriendResults(searchQuery ? resultsFriend.map(result => {
        const isFriend = friends.find((friend) => friend === result.item._id)
        if (isFriend) {
          return result.item;
        } 
      }) : null);
      } else {
      setSearchQuery("")
      setFriendResults([]);
      }
    }

    return (
        <Box>
            <Sidebar />
            <Navbar />
            <FlexBetween style={{ justifyContent: "space-around", margin: "0 0 0 100px"}}>
                <Box className="fgWidget" backgroundColor={alt}>
                    <Box className="fgHeader">
                        <Box className="fgSvg">
                          <svg width="100%" height="auto" length="auto" viewBox="0 0 772 286" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path id="header_shape" d="M385.108 284.095L16.5055 150.928C6.60029 147.35 0 137.947 0 127.416V25C0 11.1929 11.1929 0 25 0H746.732C760.539 0 771.732 11.1929 771.732 25V127.663C771.732 138.073 765.281 147.393 755.539 151.06L402.41 283.98C396.84 286.076 390.705 286.117 385.108 284.095Z" fill="#6486FF"/>
                          </svg>
                        </Box>
                        <Typography id="countHeader" fontSize="4rem" color={alt}>
                            ZNAJOMI
                        </Typography>
                        <svg id="countCircle" width="194px" height="194px" length="auto" viewBox="0 0 194 194" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g id="countCircleIn">
                            <circle id="outside" cx="97.1202" cy="97.0351" r="84.0147" fill={theme.palette.primary.dark} stroke={alt} strokeWidth="25"/>
                            <circle id="inside" cx="97.5" cy="97.5" r="72.5" fill="#6284FF"/>
                          </g>
                        </svg>
                        <Typography id="countNumber" fontSize="3rem" color={alt}>
                          <CountUp start={0} end={friends.length} duration={1.5} delay={0} />
                        </Typography>
                    </Box>
                    <Box className="fgSearch">
                        <Typography id="searchLabel" fontSize="2rem" color={theme.palette.primary.main}>
                          Wyszukaj znajomego
                        </Typography>
                        <InputBase placeholder="Wyszukaj swojego znajomego..." onChange={handleOnSearch}
                        sx={{
                          width: "70%",
                          backgroundColor: theme.palette.neutral.light,
                          borderRadius: "2rem",
                          padding: "0.25rem 2rem",
                          margin: "0 auto",
                        }} />
                    </Box>
                    <Box className="fgList">
                      {friendResults.length > 0 || searchQuery !== "" ? (
                      <WidgetWrapper>
                      <Box display="flex" gap="1.5rem 0" flexWrap="wrap" justifyContent="space-evenly" width="100%">
                      {friendResults.length > 0 ? friendResults.map(searchFriend => {
                        if (searchFriend !== undefined) {
                          const {_id, picturePath, location, firstName, lastName } = searchFriend;
                            return (
                                <Box flex="0 0 45%" border="3px solid" padding="10px 15px" borderColor={theme.palette.primary.main} key={_id} borderRadius="4rem">
                                    <Friend 
                                    key={_id}
                                    friendId={_id}
                                    name={`${firstName} ${lastName}`}
                                    subtitle={location}
                                    userPicturePath={picturePath}
                                    pageType="chats" />
                                </Box>
                            )
                        }
                      }) : null }
                      </Box>
                      </WidgetWrapper>
                      ) : <FriendListWidget userId={user._id} pageType="chats"/>}
                    </Box>
                </Box>
            </FlexBetween>
        </Box>
    )
}

export default ChatsPage;