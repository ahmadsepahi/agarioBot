/*jslint bitwise: true, node: true */
'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
var SAT = require('sat'); //Library for for performing collision detection.

// Import game settings.
var c = require('../../config.json');

// Import utilities.
var util = require('./lib/util');

const UserController = require('./user_controller');
const GameController = require('./game_controller');
const {
    connect
} = require("./sockets");
const UsersController = require("./users_controller");

let usersController = new UsersController();
var game = new GameController();

connect(io);

global.sockets = {};

var massFood = [];
var food = [];

var initMassLog = util.log(c.defaultPlayerMass, c.slowBase);

app.use(express.static(__dirname + '/../client'));

function tickPlayer(currentPlayer) {
    if (currentPlayer.lastHeartbeat < new Date().getTime() - c.maxHeartbeatInterval) {
        sockets[currentPlayer.id].emit('kick', 'Last heartbeat received over ' + c.maxHeartbeatInterval + ' ago.');
        sockets[currentPlayer.id].disconnect();
    }

    game.movePlayer(currentPlayer);
}

function moveloop() {
    users.forEach(user => {
        tickPlayer(user);
    });
}


setInterval(moveloop, 1000 / 60);
setInterval(gameloop, 1000);
setInterval(sendUpdates, 1000 / c.networkUpdateFactor);

var ipaddress =  c.host;
var serverport =  c.port;
http.listen( serverport, ipaddress, function() {
    console.log('[DEBUG] Listening on ' + ipaddress + ':' + serverport);
});
