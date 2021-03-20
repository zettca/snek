import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import express from "express";
import compression from "compression";
import SnekGame from "./snek";

// server setup
const app = express();
app.use(compression());
app.use(cors());
app.get("/", (req, res) => res.sendStatus(418));

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// game rooms setup
const socketRooms: Record<string, string> = {};
const gameRooms: Record<string, SnekGame> = {
  room1: new SnekGame({ tickTime: 200, tiles: { x: 12, y: 12 }, apples: 1 }),
  room2: new SnekGame({ tickTime: 100, tiles: { x: 20, y: 20 }, apples: 2 }),
};

for (const roomId in gameRooms) {
  const game = gameRooms[roomId];
  game.start();

  game
    .on("tick", () => io.to(roomId).emit("tick", game.getGameState()))
    .on("start", () => io.to(roomId).emit("start"))
    .on("stop", () => io.to(roomId).emit("stop"))
    .on("pause", () => io.to(roomId).emit("pause"))
    .on("resume", () => io.to(roomId).emit("resume"));
}

io.on("connection", (socket) => {
  socket.on("join", (roomId: string) => {
    const snekGame = gameRooms[roomId];
    socketRooms[socket.id] = roomId;
    snekGame.addSnake(socket.id);

    socket.join(roomId || "room1");
    socket.emit("config", snekGame?.getConfig());
  });

  socket.on("input", (data) => {
    const snekGame = gameRooms[socketRooms[socket.id]];
    snekGame?.sendDirection(socket.id, data);
  });

  socket.on("disconnect", () => {
    const snekGame = gameRooms[socketRooms[socket.id]];
    snekGame?.removeSnake(socket.id);
    delete socketRooms[socket.id];
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}...`);
});
