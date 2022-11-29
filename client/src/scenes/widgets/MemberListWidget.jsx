import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import UserWidget from "scenes/widgets/UserWidget";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const MemberListWidget = ({ groupId }) => {
    const dispatch = useDispatch();
    const { palette }= useTheme();
    const token = useSelector((state) => state.token);
    const { _id } = useSelector((state) => state.user);
    const [group, setGroup] = useState();
    let members = [];

    const getGroup = async () => {
        const response = await fetch(`http://localhost:3001/groups/${groupId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setGroup(data);
      };

    useEffect(() => {
        getGroup();
    }, []);

    if (!group) return null;

    members = group.members;

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