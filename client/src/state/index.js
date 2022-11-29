import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
    groups: [],
    members: [],
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
        }
    }
})

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, setGroups, setGroup, setGroupMembers } = authSlice.actions;
export default authSlice.reducer;