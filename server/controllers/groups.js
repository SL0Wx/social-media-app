import Group from "../models/Group.js";
import User from "../models/User.js";

/* CREATE */
export const createGroup = async (req, res) => {
    try {
        const { userId, picturePath } = req.body;
        const newGroup = new Group({
            groupName,
            picturePath,
            founderId: userId,
            members: [userId],
            posts: [],
            topic,
        })
        await newGroup.save();

        const group = await Group.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

/* READ */
export const getGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findById(id);
        res.status(200).json(group);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

export const getGroups = async (req, res) => {
    try {
        const array = await Group.find();
        res.status(200).json(array);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

/* UPDATE */
export const joinLeaveGroup = async (req, res) => {
    try {
        const { id, groupId } = req.params;
        const user = await User.findById(id);
        const group = await Group.findById(groupId);

        if (group.members.includes(id)) {
            group.members = group.members.filter((memberId) => memberId !== id);
        } else {
            group.members.push(id);
        }
        await group.save();

        const members = await Promise.all(
            group.members.map((id) => User.findById(id))
        );
        const formattedMembers = members.map(
            ({ _id, firstName, lastName, location, picturePath }) => {
                return { _id, firstName, lastName, location, picturePath };
            }
        );

        res.status(200).json(formattedMembers);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};