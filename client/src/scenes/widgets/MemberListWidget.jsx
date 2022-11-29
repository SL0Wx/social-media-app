import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import UserWidget from "scenes/widgets/UserWidget";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGroupMembers } from "state";

const MemberListWidget = ({ groupId }) => {
    const dispatch = useDispatch();
    const { palette }= useTheme();
    const token = useSelector((state) => state.token);
    const { _id } = useSelector((state) => state.user);
    const members = useSelector((state) => state.members);
    const [group, setGroup] = useState();

    const getGroup = async () => {
        const response = await fetch(`http://localhost:3001/groups/${groupId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setGroup(data);
        dispatch(setGroupMembers({ members: data.members }))
      };

    useEffect(() => {
        getGroup();
    }, []);

    if (!group) return null;

    return (
        <WidgetWrapper>
            <Typography color={palette.neutral.dark} variant="h5" fontWeight="500" sx={{ mb: "1.5rem"}}>
                Członkowie
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                {members.map((memberId) => (
                    <UserWidget userId={memberId} pageType="group" />
                ))}
            </Box>
        </WidgetWrapper>
    )
}

export default MemberListWidget;