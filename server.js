const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', socket => {
  console.log('Uživatel připojen:', socket.id);

  socket.on('signal', data => {
    io.to(data.to).emit('signal', { from: socket.id, signal: data.signal });
  });

  socket.on('disconnect', () => {
    console.log('Uživatel odpojen:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));
