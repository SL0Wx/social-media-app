import express from "express";
import { getFeedPosts, getUserPosts, likePost, getComments, commentPost, pushComment } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:postId/comments", verifyToken, getComments);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:postId/:userId", verifyToken, commentPost);
router.patch("/:postId/:commentId/comment", verifyToken, pushComment);

export default router;