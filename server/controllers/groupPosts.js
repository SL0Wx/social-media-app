import GroupPost from "../models/GroupPost.js";
import User from "../models/User.js";

/* CREATE */
export const createGroupPost = async (req, res) => {
    try {
        const { groupId, userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newGroupPost = new GroupPost({
            groupId,
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        })
        await newGroupPost.save();

        const groupPost = await GroupPost.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

/* READ */
export const getGroupPosts = async (req, res) => {
    try {
        const { groupId } = req.body;
        const groupPost = await GroupPost.find({ groupId });
        res.status(200).json(groupPost);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

/* UPDATE */
export const likeGroupPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const groupPost = await GroupPost.findById(id);
        const isLiked = groupPost.likes.get(userId);

        if (isLiked) {
            groupPost.likes.delete(userId);
        } else {
            groupPost.likes.set(userId, true);
        }

        const updatedGroupPost = await GroupPost.findByIdAndUpdate(
            id,
            { likes: groupPost.likes },
            { new: true },
        );

        res.status(200).json(updatedGroupPost);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

export const commentGroupPost = async (req, res) => {
    const { id } = req.params;
}