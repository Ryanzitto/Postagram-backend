import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import newsRoute from "./src/routes/post.route.js";
import { connectDB } from "./src/database/db.js";
import dotenv from "dotenv";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Novo cliente conectado");
  // Evento para lidar com o recebimento de mensagens
  const handleMessage = (data) => {
    console.log("Nova mensagem recebida:", data.text, "de", data.username);
    // Encaminhar a mensagem para todos os clientes conectados
    io.emit("message", data);
  };

  socket.on("message", handleMessage);

  // Remover o listener quando o cliente se desconectar
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
    socket.off("message", handleMessage); // Remover o listener do evento "message"
  });
});

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
connectDB();

app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/post", newsRoute);

const port = process.env.PORT || 3000;
const portSocket = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});

httpServer.listen(portSocket, () => {
  console.log(`Servidor rodando na porta: ${portSocket}`);
});
