import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
    {
        groupName: {
            type: String,
            required: true,
        },
        picturePath: {
            type: String,
            default: "group_icon.svg",
        },
        founderId : {
            type: String,
            required: true,
        },
        members: {
            type: Array,
            default: [],
        },
        posts: {
            type: Array,
            default: [],
        },
        topic: {
            type: String,
            required: true,
        }
    },
    { timestamps: true },
);

const Group = mongoose.model("Group", GroupSchema);

export default Group;