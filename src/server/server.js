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

app.use(express.static(__dirname + '/../client'));

SocketsHandler.connect(http, function (io, socket) {
    console.log('[INFO]: new user connected!', socket.id);

    let currentPlayer = new controllers.PlayerController(socket)
    SocketsHandler.handleAction(io, socket, currentPlayer);
});

// Don't touch, IP configurations.
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || config.host;
var serverport = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || config.port;
http.listen(serverport, ipaddress, function () {
    console.log('[DEBUG] Listening on ' + ipaddress + ':' + serverport);
});
