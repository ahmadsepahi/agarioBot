'use strict';

const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let uuid = 0;

io.on('connection', function(socket) {

  socket.emit('assign uuid', { uuid: uuid });
  uuid += 1;

  socket.on('move', function(msg) {
    console.log(msg.x, msg.y);

    io.sockets.emit('update map', { uuid: uuid, x: msg.x, y: msg.y });
  });
});

server.listen(8080, () => {
  console.log('Server has started on port: 8080');
})