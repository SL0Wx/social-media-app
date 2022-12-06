import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
        },
        postId: {
            type: String,
        },
        text: {
            type: String,
        },
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;