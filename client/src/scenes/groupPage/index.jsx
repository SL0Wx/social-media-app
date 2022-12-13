import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import Sidebar from "components/Sidebar";
import GroupWidget from "scenes/widgets/GroupWidget";
import MemberListWidget from "scenes/widgets/MemberListWidget";
import MyGroupPostWidget from "scenes/widgets/MyGroupPostWidget";
import GroupPostsWidget from "scenes/widgets/GroupPostsWidget";

const GroupPage = () => {
    const [group, setGroup] = useState(null);
    const { groupId } = useParams();
    const [founderId, setFounderId] = useState(null);
    const [isMember, setIsMember] = useState(null);
    const {_id, picturePath } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

    const getGroup = async () => {
        const response = await fetch(`http://localhost:3001/groups/${groupId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setFounderId(data.founderId);
        setGroup(data);
        const members = data.members;
        const member = members.find((memberId) => memberId === _id);
        setIsMember(member);
    };

    useEffect(() => {
        getGroup();
    }, []);

    if (!group) return null;

    return (
        <Box>
            <Sidebar selected="groups"/>
            <Navbar />
            <Box width={isNonMobileScreens ? "100%" : "85%"} padding="2rem 6%" display={isNonMobileScreens ? "flex" : "block"} gap="2rem" justifyContent="center" marginLeft="100px" >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <GroupWidget groupId={groupId} founderId={founderId} />
                    <Box m="2rem 0" />
                    <MemberListWidget groupId={groupId} />
                </Box>
                <Box flexBasis={isNonMobileScreens ? "42%" : undefined}>
                    {isMember ? (
                        <Box mt={isNonMobileScreens ? "0" : "2rem"}>
                          <MyGroupPostWidget groupId={groupId} userPicturePath={picturePath} />
                        </Box>
                    ) : null}
                    <Box mt={isNonMobileScreens && !isMember ? "-2rem" : "2rem"}>
                        <GroupPostsWidget groupId={groupId} groupName={group.groupName} groupPicturePath={group.picturePath} />
                    </Box>
                </Box>
                {isNonMobileScreens && <Box flexBasis="26%"></Box>}
            </Box>
        </Box>
    )
}

export default GroupPage;