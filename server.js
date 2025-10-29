const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', socket => {
  console.log('Uživatel připojen:', socket.id);

  socket.on('join', room => {
    socket.join(room);
    const clients = io.sockets.adapter.rooms.get(room);
    const numClients = clients ? clients.size : 0;

    if (numClients === 1) {
      socket.emit('created', room);
    } else if (numClients === 2) {
      io.to(room).emit('ready');
      socket.emit('joined', room);
    } else {
      socket.emit('full', room);
    }
  });

  socket.on('signal', ({ room, data }) => {
    socket.to(room).emit('signal', { data });
  });

  socket.on('disconnect', () => {
    console.log('Uživatel odpojen:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Signální server běží na portu ${PORT}`));
