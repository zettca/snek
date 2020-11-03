import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import cors from 'cors';
import sio from 'socket.io';
import express from 'express';
import compression from 'compression';
import SnekGame from './snek/GameManager.js';

const app = express();
const server = http.Server(app);
const io = sio(server);

const clientPath = join(dirname(fileURLToPath(import.meta.url)), '../client/build');
app.use(compression());
app.use(cors({ credentials: true, origin: true }));
app.use('/', express.static(clientPath));
app.use('/static', express.static(clientPath + '/static'));

const sockets = [];
const gameConfig = {
  tickTime: 125,
  tiles: { x: 16, y: 16 },
};
const snekInstance = new SnekGame(gameConfig).start();

snekInstance.on('statechange', () => {
  io.emit('statechange', snekInstance.getGameState());
});

snekInstance.on('gamestop', () => {
  io.emit('gamestop');
});

io.on('connection', (socket) => {
  sockets.push(socket);
  snekInstance.addSnake(socket.id);
  socket.emit('gamestart', snekInstance.getTileConfig());

  socket.on('input', (data) => {
    snekInstance.sendDirection(socket.id, data);
  });
  socket.on('disconnect', () => {
    snekInstance.removeSnake(socket.id);
    sockets.splice(sockets.indexOf(socket), 1);
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server running at ${port}...`);
});
