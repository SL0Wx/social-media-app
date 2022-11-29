import { ManageAccountsOutlined, AutoAwesome, GroupAddOutlined, GroupRemoveOutlined } from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import Group from "components/Group";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setGroupMembers } from "state";

const GroupWidget = ({ groupId, founderId }) => {
    const dispatch = useDispatch();
    const groupMembers = useSelector((state) => state.members);
    const [group, setGroup] = useState(null);
    const [founder, setFounder] = useState(null);
    const { _id } = useSelector((state) => state.user);
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    const getGroup = async () => {
        const response = await fetch(`http://localhost:3001/groups/${groupId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setGroup(data);
        dispatch(setGroupMembers({ members: data.members }));
    };

    const getFounder = async () => {
        const response = await fetch(`http://localhost:3001/users/${founderId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setFounder(data);
    };

    const patchMember = async () => {
        const response = await fetch(
            `http://localhost:3001/groups/${groupId}/${_id}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const members = await response.json();
        dispatch(setGroupMembers({ members: members}));
    }

    useEffect(() => {
        getGroup();
        getFounder();
    }, []);

    if (!group) return null;
    if (!founder) return null;

    //console.log(founder);
    const { groupName, members, posts, topic } = group;
    const { firstName, lastName, picturePath } = founder;
    const isMember = groupMembers.find((memberId) => memberId === _id);
    const isFounder = group.founderId === _id;

    return (
        <WidgetWrapper>
            {/* FIRST ROW */}
            <FlexBetween gap="0.5rem" pb="1.1rem">
                <FlexBetween gap="1rem">
                    <UserImage image={group.picturePath} />
                    <Box id="ID" display="flex" flexDirection="row">
                        <FlexBetween flexDirection="column" alignItems="flex-start !important" gap="0.1rem">
                            <Typography variant="h4" color={dark} fontWeight="500"
                            sx={{
                                "&:hover": {
                                    color: palette.primary.main,
                                    cursor: "pointer"
                                }
                            }}
                            onClick={() => {
                                navigate(`/group/${groupId}`);
                                navigate(0);
                            }
                            }>
                                {groupName}
                            </Typography>
                            <Typography color={medium}>{groupMembers.length} {groupMembers.length > 1 ? "Członków" : (groupMembers.length == 1 ? "Członek" : "Członków")}</Typography>
                        </FlexBetween>
                    </Box>
                </FlexBetween>
                <FlexBetween>
                        {!isFounder ? (
                            <IconButton onClick={() => patchMember()}
                            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}>
                                {isMember ? (
                                    <GroupRemoveOutlined sx={{ color: primaryDark }} />
                                ) : (
                                    <GroupAddOutlined sx={{ color: primaryDark }} />
                                )}
                            </IconButton>
                        ) : null}
                    </FlexBetween>
            </FlexBetween>

            <Divider />

            {/* SECOND ROW */}
            <Box p="1rem 0">
                <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                    <AutoAwesome fontSize="large" sx={{ color: main }} />
                    <Typography color={medium}>Tematyka: {topic}</Typography>
                </Box>
            </Box>

            {/* THIRD ROW */}
            <FlexBetween gap="0.5rem" pb="1.1rem">
                <FlexBetween gap="1rem">
                    <UserImage image={picturePath} size="30px"/>
                    <Box>
                        <Typography color={medium} fontWeight="500"
                        sx={{
                            "&:hover": {
                                color: palette.primary.main,
                                cursor: "pointer"
                            }
                        }}
                        onClick={() => navigate(`/profile/${founderId}`)}>
                            Założyciel: {firstName} {lastName}
                        </Typography>
                    </Box>
                </FlexBetween>
            </FlexBetween>
        </WidgetWrapper>
    );
}

export default GroupWidget;