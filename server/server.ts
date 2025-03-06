import { serve } from "https://deno.land/std@0.165.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { SnekManager as SnekGame, GameOptions } from "./snek.ts";

const io = new Server({ cors: { origin: true, credentials: true } });

const makeGame = (
  tickTime: number,
  size: number,
  options: Partial<GameOptions>
) => {
  return new SnekGame({ tickTime, tiles: { x: size, y: size }, ...options });
};

// game rooms setup
const socketRooms = new Map<string, SnekGame>();
const gameRooms = new Map<string, SnekGame>();

gameRooms.set("room1", makeGame(160, 12, { apples: 2 }));
gameRooms.set("room2", makeGame(120, 20, { apples: 2 }));
gameRooms.set("room3", makeGame(120, 32, { apples: 4 }));

for (const [roomId, game] of gameRooms) {
  game.start();

  game
    .on("tick", () => io.to(roomId).emit("tick", game.getGameState()))
    .on("start", () => io.to(roomId).emit("start"))
    .on("stop", () => io.to(roomId).emit("stop"))
    .on("pause", () => io.to(roomId).emit("pause"))
    .on("resume", () => io.to(roomId).emit("resume"));
}

io.on("connection", (socket) => {
  socket.on("join", (roomId = "room1") => {
    const snekGame = gameRooms.get(roomId);
    if (!snekGame) return;

    socketRooms.set(socket.id, snekGame);
    snekGame.addSnake(socket.id);

    socket.join(roomId);
    socket.emit("config", snekGame.getConfig());
  });

  socket.on("input", (data) => {
    const snekGame = socketRooms.get(socket.id);
    snekGame?.sendDirection(socket.id, data);
  });

  socket.on("disconnect", () => {
    const snekGame = socketRooms.get(socket.id);
    snekGame?.removeSnake(socket.id);
    socketRooms.delete(socket.id);
  });
});

const port = Number(Deno.env.get("PORT")) || 8080;
await serve(io.handler(), { port });
