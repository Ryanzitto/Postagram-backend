import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
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

export { app, io, server };
