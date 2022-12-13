import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGroupPosts } from "state";
import GroupPostWidget from "./GroupPostWidget";
import WidgetWrapper from 'components/WidgetWrapper';
import FlexBetween from 'components/FlexBetween';
import { Typography } from '@mui/material';

const GroupPostsWidget = ({ groupId, groupName, groupPicturePath }) => {
    const dispatch = useDispatch();
    const groupPosts = useSelector((state) => state.groupPosts);
    const token = useSelector((state) => state.token);

    const getGroupPosts = async () => {
        const response = await fetch(`http://localhost:3001/groupPosts/${groupId}/groupPosts`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`},
        });
        const data = await response.json();
        dispatch(setGroupPosts({ groupPosts: data}));
    }
    
    useEffect(() => {
        getGroupPosts();
    }, []);

    return (
        <>
            {groupPosts.length > 0 ? (
                <>
                    {groupPosts.map(
                    ({
                        _id,
                        userId,
                        firstName,
                        lastName,
                        description,
                        picturePath,
                        likes,
                        comments,
                        createdAt,
                    }) => (
                        <GroupPostWidget
                            key={_id}
                            postId={_id}
                            postUserId={userId}
                            groupName={groupName}
                            groupId={groupId}
                            name={`${firstName} ${lastName}`}
                            description={description}
                            picturePath={picturePath}
                            groupPicturePath={groupPicturePath}
                            likes={likes}
                            comments={comments}
                            createdAt={createdAt}
                        />
                    )
                    )}
                </>
            ) : (
                <>
                    <WidgetWrapper m="2rem 0">
                        <FlexBetween gap="1.5rem">
                            <Typography>Nie ma tu jeszcze żadnego posta :/</Typography>
                        </FlexBetween>
                    </WidgetWrapper>
                </>
            )}
            
        </>
    )
};

export default GroupPostsWidget;
