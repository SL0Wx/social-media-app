import mongoose from "mongoose";

const GroupPostSchema = mongoose.Schema(
    {
        groupId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        description: String,
        picturePath: String,
        userPicturePath: String,
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true },
);

const GroupPost = mongoose.model("GroupPost", GroupPostSchema);

export default GroupPost;