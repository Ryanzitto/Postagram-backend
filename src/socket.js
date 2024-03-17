import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

let connectedUsers = [];

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("userConnected", (username) => {
    console.log("Usuário conectado:", username);
    connectedUsers.push(username);
    io.emit("updateUsers", connectedUsers);
  });

  socket.on("userDisconnected", (username) => {
    console.log("Usuário desconectado:", username);
    connectedUsers = connectedUsers.filter((user) => user !== username);
    io.emit("updateUsers", connectedUsers);
  });

  const handleMessage = (data) => {
    console.log("Nova mensagem recebida:", data.text, "de", data.username);
    io.emit("message", data);
  };

  socket.on("message", handleMessage);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
    socket.off("message", handleMessage);
  });
});

export { app, io, server };
