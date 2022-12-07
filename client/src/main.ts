import { io } from "socket.io-client";
import "./index.css";
import { GameConfig, GameState } from "./types";
import { dirFromEvent, dirFromTouch } from "./utils";
import { GameRenderer } from "./GameRenderer";

const { VITE_URL: URL } = import.meta.env;

const root = document.getElementById("root") as HTMLDivElement;
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
root.appendChild(canvas);

// Game setup
const size = { width: canvas.width, height: canvas.height };
const gameRenderer = new GameRenderer(ctx!, { size });

const searchParams = new URLSearchParams(location.search);

const url = searchParams.get("server") || URL || prompt("Server URL");

const socket = io(url || "");

socket.on("connect", () => {
  console.log(`Connected to: ${url} - ${socket.id}`);

  const roomId = document.location.hash.slice(1) || "room1";
  socket.emit("join", roomId);
});

socket.on("config", ({ tileCount }: GameConfig) => {
  gameRenderer.setNumTiles({ ...tileCount });
});

socket.on("tick", (state: GameState) => {
  requestAnimationFrame(() => gameRenderer.draw(state));
});

// event setup
const touchStart = { x: 0, y: 0 };

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("touchstart", handleTouchStart, false);
window.addEventListener("touchend", handleTouchEnd, false);
window.addEventListener("resize", resizeWindow);

// TODO: review window resizing
document.addEventListener("DOMContentLoaded", resizeWindow, false);

function handleKeyDown(e: KeyboardEvent) {
  const dir = dirFromEvent(e);
  socket.emit("input", dir);
}

function handleTouchStart(e: TouchEvent) {
  touchStart.x = e.changedTouches[0].screenX;
  touchStart.y = e.changedTouches[0].screenY;
}

function handleTouchEnd(e: TouchEvent) {
  const dX = e.changedTouches[0].screenX - touchStart.x;
  const dY = e.changedTouches[0].screenY - touchStart.y;
  const dir = dirFromTouch(dX, dY);
  if (dir) socket.emit("input", dir);
}

function resizeWindow() {
  const { clientWidth, clientHeight } = document.body || {};
  const size = Math.min(clientWidth, clientHeight);
  canvas.width = size;
  canvas.height = size;

  gameRenderer.setSize({ width: size, height: size });
}
