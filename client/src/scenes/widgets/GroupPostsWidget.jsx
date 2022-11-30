import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGroupPosts } from "state";
import GroupPostWidget from "./GroupPostWidget";

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
    )
};

export default GroupPostsWidget;
