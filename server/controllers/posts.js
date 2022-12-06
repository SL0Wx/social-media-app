import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath, profile } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        })
        await newPost.save();

        let posts;
        if (profile) {
            posts = await Post.find({ userId: userId}).sort({createdAt: -1});
        } else {
            posts = await Post.find().sort({createdAt: -1});
        }

        res.status(201).json(posts);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find().sort({createdAt: -1});
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId }).sort({createdAt: -1});
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true },
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ postId: postId });

        res.status(200).json(comments);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

export const commentPost = async (req, res) => {
    try {
        const { postId, userId } = req.params;
        const { text } = req.body;
        const newComment = new Comment({
            userId,
            postId,
            text,
        });
        await newComment.save();

        res.status(200).json(newComment);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const pushComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const post = await Post.findById(postId);
        post.comments.push(commentId);
        await post.save();

        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}