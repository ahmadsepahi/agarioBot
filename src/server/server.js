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

var V = SAT.Vector;
var C = SAT.Circle;

var initMassLog = util.log(c.defaultPlayerMass, c.slowBase);

app.use(express.static(__dirname + '/../client'));

function tickPlayer(currentPlayer) {
    if (currentPlayer.lastHeartbeat < new Date().getTime() - c.maxHeartbeatInterval) {
        global.sockets[currentPlayer.id].emit('kick', 'Last heartbeat received over ' + c.maxHeartbeatInterval + ' ago.');
        global.sockets[currentPlayer.id].disconnect();
    }

    game.movePlayer(currentPlayer);
}

function moveloop() {
    users.forEach(user => {
        tickPlayer(user);
    });
}

function gameloop() {
	let users = usersController.getUsers();
    if (users.length > 0) {
        users.sort(function (a, b) {
            return b.massTotal - a.massTotal;
        });

        users.forEach(user => {
            user.cells.forEach(cell => {
                if (cell.mass * (1 - (c.massLossRate / 1000)) > c.defaultPlayerMass && user.massTotal > c.minMassLoss) {
                    let massLoss = cell.mass * (1 - (c.massLossRate / 1000));
                    user.massTotal -= cell.mass - massLoss;
                    cell.mass = massLoss;
                }
            });
        });
    }

    game.balanceMass(users, food);
}

function sendUpdates() {
	let users = usersController.getUsers();
    users.forEach(function (u) {
        // center the view if x/y is undefined, this will happen for spectators
        u.x = u.x || c.gameWidth / 2;
        u.y = u.y || c.gameHeight / 2;

        var visibleFood = food
            .map(function (f) {
                if (f.x > u.x - u.screenWidth / 2 - 20 &&
                    f.x < u.x + u.screenWidth / 2 + 20 &&
                    f.y > u.y - u.screenHeight / 2 - 20 &&
                    f.y < u.y + u.screenHeight / 2 + 20) {
                    return f;
                }
            })
            .filter(function (f) {
                return f;
            });

        var visibleMass = massFood
            .map(function (f) {
                if (f.x + f.radius > u.x - u.screenWidth / 2 - 20 &&
                    f.x - f.radius < u.x + u.screenWidth / 2 + 20 &&
                    f.y + f.radius > u.y - u.screenHeight / 2 - 20 &&
                    f.y - f.radius < u.y + u.screenHeight / 2 + 20) {
                    return f;
                }
            })
            .filter(function (f) {
                return f;
            });

        var visibleCells = users
            .map(function (f) {
                for (var z = 0; z < f.cells.length; z++) {
                    if (f.cells[z].x + f.cells[z].radius > u.x - u.screenWidth / 2 - 20 &&
                        f.cells[z].x - f.cells[z].radius < u.x + u.screenWidth / 2 + 20 &&
                        f.cells[z].y + f.cells[z].radius > u.y - u.screenHeight / 2 - 20 &&
                        f.cells[z].y - f.cells[z].radius < u.y + u.screenHeight / 2 + 20) {
                        z = f.cells.lenth;
                        if (f.id !== u.id) {
                            return {
                                id: f.id,
                                x: f.x,
                                y: f.y,
                                cells: f.cells,
                                massTotal: Math.round(f.massTotal),
                                hue: f.hue,
                                name: f.name
                            };
                        } else {
                            return {
                                x: f.x,
                                y: f.y,
                                cells: f.cells,
                                massTotal: Math.round(f.massTotal),
                                hue: f.hue,
                            };
                        }
                    }
                }
            })
            .filter(function (f) {
                return f;
            });

        global.sockets[u.id].emit('serverTellPlayerMove', visibleCells, visibleFood, visibleMass);
    });
}

setInterval(moveloop, 1000 / 60);
setInterval(gameloop, 1000);
setInterval(sendUpdates, 1000 / c.networkUpdateFactor);

var ipaddress =  c.host;
var serverport =  c.port;
exports.server = http.listen( serverport, ipaddress, function() {
    console.log('[DEBUG] Listening on ' + ipaddress + ':' + serverport);
});
