import express from "express";
import cors from "cors";
import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import newsRoute from "./src/routes/post.route.js";
import pictureRoute from "./src/routes/picture.route.js";
import uploadRoute from "./src/routes/upload.route.js";
import { connectDB } from "./src/database/db.js";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/post", newsRoute);
app.use("/picture", pictureRoute);
app.use("/upload", uploadRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Servidor rodando na porta: ${port}`));
