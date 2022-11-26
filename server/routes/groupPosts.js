import express from "express";
import { getGroupPosts, likeGroupPost } from "../controllers/groupPosts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/groupPosts", verifyToken, getGroupPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likeGroupPost);

export default router;