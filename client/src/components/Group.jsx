import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useSelector } from "react-redux";

const Group = ({ groupId, groupName, picturePath, founderId, members, topic }) => {
    const navigate = useNavigate();
    const { _id } = useSelector((state) => state.user);

    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
 
    const isMember = members.find((memberId) => memberId === _id);
    return (
        <FlexBetween m="auto" width="50%">
            {isMember ? (
                <FlexBetween gap="1rem">
                    <UserImage image={picturePath} />
                    <Box>
                    <Typography
                        color={main}
                        variant="h5"
                        fontWeight="500"
                        sx={{
                        "&:hover": {
                            color: palette.primary.main,
                            cursor: "pointer",
                        },
                        }}
                        onClick={() => {
                        navigate(`/group/${groupId}`);
                        navigate(0);
                        }}
                    >
                        {groupName}
                    </Typography>
                    <Typography color={medium} fontSize="0.75rem">
                        {topic} {members.length} członków
                    </Typography>
                    </Box>
                </FlexBetween>
            ) : null}
        </FlexBetween>
    )
}

export default Group;