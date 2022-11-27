import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import MyFriend from "components/MyFriend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGroups } from "state";
import Group from "components/Group";

const GroupListWidget = ({ userId, pageType }) => {
    const dispatch = useDispatch();
    const { palette }= useTheme();
    const token = useSelector((state) => state.token);
    const { _id } = useSelector((state) => state.user);
    const groups = useSelector((state) => state.groups);

    const getGroups = async () => {
        const response = await fetch("http://localhost:3001/groups", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setGroups({ groups: data }));
    };

    useEffect(() => {
        getGroups();
    }, []);

    return (
        <WidgetWrapper>
            {pageType !== "groups" ? (
              <>
                <Typography color={palette.neutral.dark} variant="h5" fontWeight="500" sx={{ mb: "1.5rem"}}>
                  Grupy do których należysz
                </Typography>
                <Box display="flex" flexDirection="column" gap="1.5rem">
                  {groups.map((group) => (
                    <Group groupId={group._id} groupName={group.groupName} picturePath={group.picturePath} founderId={group.founderId} members={group.members} topic={group.topic} />
                  ))}
                </Box>
              </>
            ) : 
            <Box display="flex" gap="1.5rem 0" flexWrap="wrap" justifyContent="space-evenly" width="100%">
              {groups.map((group) => (
                <Box flex="0 0 100%" border="3px solid" padding="10px 15px" key={group._id} borderColor={palette.primary.main}  borderRadius="4rem">
                  <Group groupId={group._id} groupName={group.groupName} picturePath={group.picturePath} founderId={group.founderId} members={group.members} topic={group.topic} />
                </Box>
              ))}
            </Box>
            }
        </WidgetWrapper>
    )
}

export default GroupListWidget;