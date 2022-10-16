import { serve } from "https://deno.land/std@0.159.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { SnekManager as SnekGame } from "./src/snek/index.ts";

const io = new Server({ cors: { origin: true, credentials: true } });

// game rooms setup
const socketRooms: Record<string, SnekGame> = {};
const gameRooms: Record<string, SnekGame> = {
  room1: new SnekGame({ tickTime: 200, tiles: { x: 12, y: 12 }, apples: 1 }),
  room2: new SnekGame({ tickTime: 100, tiles: { x: 20, y: 20 }, apples: 2 }),
  room3: new SnekGame({ tickTime: 100, tiles: { x: 32, y: 32 }, apples: 4 }),
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
    const room = gameRooms[roomId] ? roomId : "room1";
    const snekGame = gameRooms[room];
    socketRooms[socket.id] = snekGame;
    snekGame.addSnake(socket.id);

    socket.join(room);
    socket.emit("config", snekGame?.getConfig());
  });

  socket.on("input", (data) => {
    const snekGame = socketRooms[socket.id];
    snekGame?.sendDirection(socket.id, data);
  });

  socket.on("disconnect", () => {
    const snekGame = socketRooms[socket.id];
    snekGame?.removeSnake(socket.id);
    delete socketRooms[socket.id];
  });
});

const port = Number(Deno.env.get("PORT")) || 8080;
await serve(io.handler(), { port });
