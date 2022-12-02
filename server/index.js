import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import groupRoutes from "./routes/groups.js";
import groupPostRoutes from "./routes/groupPosts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { createGroup } from "./controllers/groups.js";
import { createGroupPost } from "./controllers/groupPosts.js";
import { verifyToken } from "./middleware/auth.js";
import { createServer } from "http";
import { Server } from "socket.io";

/* CONFIG */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));
app.get("/", (req, res) => {
    res.send("Server Running!");
});

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.post("/groups/create", verifyToken, upload.single("picture"), createGroup);
app.post("/groupPosts/create", verifyToken, upload.single("picture"), createGroupPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/groups", groupRoutes);
app.use("/groupPosts", groupPostRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));

/* SOCKET.IO SETUP */
const server = createServer(app);
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join-chat", (room) => {
        socket.join(room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"));

    socket.on("new-message", (newMessageRecevied) => {
        let chat = newMessageRecevied.chat;
        if (!chat.users) return console.log(`chat.users not defined`);

        chat.users.forEach((user) => {
            if (user._id === newMessageRecevied.sender._id) return;

            socket.in(user._id).emit("message-recevied", new MessageRecevied);
        });
    });

    socket.off("setup", () => {
        socket.leave(userData._id);
    });
});