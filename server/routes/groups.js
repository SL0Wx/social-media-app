import express from "express";
import { getGroup, getGroups, joinLeaveGroup } from "../controllers/groups.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getGroup);
router.get("/", verifyToken, getGroups);

/* UPDATE */
router.patch("/:id/:userId", verifyToken, joinLeaveGroup);

export default router;