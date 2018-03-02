'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var SocketsHandler = require('./sockets');

// Import game settings.
var config = require('../../config.json');

// Import utilities.
var util = require('./lib/util');

app.use(express.static(__dirname + '/../client'));

// SocketsHandler.connect(http, function(io, socket) {
//   console.log('New user connected!', socket.handshake.query.type);

//   let type = socket.handshake.query.type;
//   let radius = util.massToRadius(c.defaultPlayerMass);
//   let position = c.newPlayerInitialPosition == 'farthest' ? util.uniformPosition(users, radius) : util.randomPosition(radius);

//   var cells = [];
//   var massTotal = 0;

//   if (type === 'player') {
//       cells = [{
//           mass: c.defaultPlayerMass,
//           x: position.x,
//           y: position.y,
//           radius: radius
//       }];
//       massTotal = c.defaultPlayerMass;
//   }

//   let currentPlayer = {
//       id: socket.id,
//       x: position.x,
//       y: position.y,
//       w: c.defaultPlayerMass,
//       h: c.defaultPlayerMass,
//       cells: cells,
//       massTotal: massTotal,
//       hue: Math.round(Math.random() * 360),
//       type: type,
//       lastHeartbeat: new Date().getTime(),
//       target: {
//           x: 0,
//           y: 0
//       }
//   };

//   SocketsHandler.handleAction(io, socket, currentPlayer);
// });

// Don't touch, IP configurations.
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || config.host;
var serverport = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || config.port;
http.listen(serverport, ipaddress, function () {
    console.log('[DEBUG] Listening on ' + ipaddress + ':' + serverport);
});