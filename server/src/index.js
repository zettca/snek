import { Server } from "http";
import cors from "cors";
import sio from "socket.io";
import express from "express";
import compression from "compression";
import SnekGame from "./snek";

// server setup
const app = express();
app.use(compression());
app.use(cors({ credentials: true, origin: true }));

const server = new Server(app);
const io = sio(server);

// game socket setup
const sockets = [];
const snekGame = new SnekGame({
  tickTime: 125,
  tiles: { x: 16, y: 16 },
  apples: 6,
});
snekGame.start();

snekGame
  .on("tick", () => io.emit("tick", snekGame.getGameState()))
  .on("stop", () => io.emit("stop"))
  .on("pause", () => io.emit("pause"))
  .on("resume", () => io.emit("resume"));

io.on("connection", (socket) => {
  sockets.push(socket);
  snekGame.addSnake(socket.id);

  socket.emit("config", snekGame.getConfig());

  socket.on("input", (data) => {
    snekGame.sendDirection(socket.id, data);
  });
  socket.on("disconnect", () => {
    snekGame.removeSnake(socket.id);
    sockets.splice(sockets.indexOf(socket), 1);
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server running at ${port}...`);
});
