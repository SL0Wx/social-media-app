import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
    friends: [],
    groups: [],
    members: [],
    groupPosts: [],
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) => {
            if (state.user) {
              state.user.friends = action.payload.friends;
            } else {
              console.error("user friends non-existent :(");
            }
          },
        setUserFriends: (state, action) => {
            if (state.friends) {
                state.friends = action.payload.friends;
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id) return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        },
        setGroups: (state, action) => {
            state.groups = action.payload.groups;
        },
        setGroup: (state, action) => {
            const updatedGroups = state.groups.map((group) => {
                if (group._id === action.payload.group._id) return action.payload.group;
                return group;
            });
            state.groups = updatedGroups;
        },
        setGroupMembers: (state, action) => {
            if (state.members) {
                state.members = action.payload.members;
            }
        },
        setGroupPosts: (state, action) => {
            state.groupPosts = action.payload.groupPosts;
        },
        setGroupPost: (state, action) => {
            const updatedGroupPosts = state.groupPosts.map((groupPost) => {
                if (groupPost._id === action.payload.groupPost._id) return action.payload.groupPost;
                return groupPost;
            });
            state.groupPosts = updatedGroupPosts;
        },
    }
})

export const { setMode, setLogin, setLogout, setFriends, setUserFriends, setPosts, setPost, setGroups, setGroup, setGroupMembers, setGroupPosts, setGroupPost } = authSlice.actions;
export default authSlice.reducer;