import express from "express";
import { getGroupPosts, likeGroupPost, commentGroupPost } from "../controllers/groupPosts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:groupId/groupPosts", verifyToken, getGroupPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likeGroupPost);
router.patch("/:id/comment", verifyToken, commentGroupPost);

export default router;