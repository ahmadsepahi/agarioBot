/*jslint bitwise: true, node: true */
'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);


// Import game settings.
var c = require('../../config.json');

// Import utilities.
var util = require('./lib/util');



const UserController = require('./user_controller');
const GameController = require('./game_controller');

var game = new GameController();

var users = [];
var massFood = [];
var food = [];
var sockets = {};

var initMassLog = util.log(c.defaultPlayerMass, c.slowBase);

app.use(express.static(__dirname + '/../client'));

io.on('connection', function(socket) {
    console.log('A user connected!', socket.handshake.query.type);

    var type = socket.handshake.query.type;
    var radius = util.massToRadius(c.defaultPlayerMass);
    var position = c.newPlayerInitialPosition == 'farthest' ? util.uniformPosition(users, radius) : util.randomPosition(radius);

    var cells = [];
    var massTotal = 0;
    if(type === 'player') {
        cells = [{
            mass: c.defaultPlayerMass,
            x: position.x,
            y: position.y,
            radius: radius
        }];
        massTotal = c.defaultPlayerMass;
    }

    let currentPlayer = new UserController(socket.id, position, radius, massTotal, cells, type, c);

    socket.on('gotit', function (player) {
    
    });

    socket.on('pingcheck', function () {
        socket.emit('pongcheck');
    });

    socket.on('respawn', function () {
        if (util.findIndex(users, currentPlayer.id) > -1)
            users.splice(util.findIndex(users, currentPlayer.id), 1);
        socket.emit('welcome', currentPlayer);
        console.log('[INFO] User ' + currentPlayer.name + ' respawned!');
    });

    socket.on('disconnect', function () {
        if (util.findIndex(users, currentPlayer.id) > -1)
            users.splice(util.findIndex(users, currentPlayer.id), 1);

        socket.broadcast.emit('playerDisconnect', { name: currentPlayer.name });
    });

    socket.on('pass', function(data) {

    });

    socket.on('kick', function(data) {

    });

    // Heartbeat function, update everytime.
    socket.on('heartbeat', function(target) {
        currentPlayer.lastHeartbeat = new Date().getTime();
        if (target.x !== currentPlayer.x || target.y !== currentPlayer.y) {
            currentPlayer.target = target;
        }
    });
});


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
