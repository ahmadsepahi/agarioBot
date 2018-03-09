var express = require('express');
var app = express();
var http = require('http').Server(app);
var SocketsHandler = require('./sockets');
// var io = require('socket.io')(http);

// Import game settings.
var config = require('../../config.json');


var controllers = require('./controllers/controllers');
var PlayerController = require('./controllers/player_controller');

// Import utilities.
var util = require('./lib/util');

var users = {};
var sockets = {};

app.use(express.static(__dirname + '/../client'));

SocketsHandler.connect(http, function (io, socket) {
  console.log('[INFO]: new user connected!', socket.id);

  let currentPlayer = new PlayerController.PlayerController(socket);
  users[currentPlayer.id] = currentPlayer;
  sockets[socket.id] = socket;

  SocketsHandler.handleAction(io, socket, currentPlayer);
});

// function tick(currentPlayer) {
//   let now = new DateTime.getTime();
//   let maxHearbreakInterval = 1000; 
  
//   if (now - maxHearbreakInterval > currentPlayer.getLastHeartbreak()) {
//     let socket = socket[currentPlayer.id];

//     socket.emit('kick');
//     socket.disconnect();

//     delete users[currentPlayer.id];
//     delete sockets[currentPlayer.id];
//   };
// }

// function gameloop() {
//   console.log(users);
//   // users.forEach(user => {
//   //   tick(user);
//   // });
// }

// setInterval(moveloop, 1000 / 60);
// setInterval(gameloop, 1000);
// setInterval(sendUpdates, 1000);

// Don't touch, IP configurations.
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || config.host;
var serverport = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || config.port;
http.listen(serverport, ipaddress, function () {
    console.log('[DEBUG] Listening on ' + ipaddress + ':' + serverport);
});
