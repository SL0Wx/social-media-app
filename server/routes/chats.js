import express from "express";
import { createChat, findChat, userChats } from "../controllers/chats.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create/:firstId/:secondId", verifyToken, createChat);
router.get("/:userId", verifyToken, userChats);
router.get("/find/:firstId/:secondId", verifyToken, findChat);

export default router;