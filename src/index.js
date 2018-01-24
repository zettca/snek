import { join } from 'path';
import cors from 'cors';
import express from 'express';
import compression from 'compression';
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

import SnekGameManager from './snek/GameManager';

const clientPath = join(__dirname, '../client/build');
console.log(clientPath);
app.use(compression());
app.use(cors({ credentials: true, origin: true }));
app.use('/', express.static(clientPath));
app.use('/static', express.static(clientPath + '/static'));

const sockets = [];
const snekInstance = new SnekGameManager(100, { x: 10, y: 10 });
snekInstance.start();

snekInstance.on('statechange', () => {
  const gameState = snekInstance.getGameState();
  io.emit('statechange', gameState);
});

io.on('connection', (socket) => {
  sockets.push(socket);
  snekInstance.addSnake(socket.id);

  socket.on('input', (data) => {
    snekInstance.sendDirection(socket.id, data);
  });
  socket.on('disconnect', () => {
    snekInstance.removeSnake(socket.id);
    sockets.splice(sockets.indexOf(socket), 1);
  });
});

const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log(`Server running at ${port}...`);
});
