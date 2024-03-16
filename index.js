import express from "express";
import cors from "cors";
import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import newsRoute from "./src/routes/post.route.js";
import { connectDB } from "./src/database/db.js";
import dotenv from "dotenv";
import { app, server } from "./src/socket.js";

app.use(express.json());
app.use(cors());
dotenv.config();
connectDB();

app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/post", newsRoute);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
