'use strict';

const PlayerController = require('./player_controller');
var util = require('./lib/util');
var conf = require('../../config.json');
const UsersController = require("./users_controller");

let usersController = new UsersController();

exports.connect = function(io) {
    io.on('connection', function(socket) {
        console.log('A user connected!', socket.handshake.query.type);
    
        var type = socket.handshake.query.type;
        var radius = util.massToRadius(conf.defaultPlayerMass);
        var position = conf.newPlayerInitialPosition == 'farthest' ? util.uniformPosition(usersController.getUsers(), radius) : util.randomPosition(radius);
    
        var cells = [];
        var massTotal = 0;
        if(type !== 'spectate') {
            cells = [{
                mass: conf.defaultPlayerMass,
                x: position.x,
                y: position.y,
                radius: radius
            }];
            massTotal = conf.defaultPlayerMass;
        }
    
        let currentPlayer = new PlayerController(socket.id, position, radius, massTotal, cells, type, conf);
    
        socket.on('pingcheck', function () {
            socket.emit('pongcheck');
        });
    
        socket.on('gotit', function (player) {
            console.log('[INFO] Player ' + player.name + ' connecting!');
    
            if (!util.validNick(player.name)) {
                socket.emit('kick', 'Invalid username.');
                socket.disconnect();
            } else {
                console.log('[INFO] Player ' + player.name + ' connected!');
                global.sockets[player.id] = socket;
    
                var radius = util.massToRadius(conf.defaultPlayerMass);
                var position = conf.newPlayerInitialPosition == 'farthest' ? util.uniformPosition(usersController.getUsers(), radius) : util.randomPosition(radius);
    
                player.x = position.x;
                player.y = position.y;
                player.target.x = 0;
                player.target.y = 0;
                if(type === 'spectate') {
                    player.cells = [];
                    player.massTotal = 0;
                }
                else {
                    player.cells = [{
                        mass: conf.defaultPlayerMass,
                        x: position.x,
                        y: position.y,
                        radius: radius
                    }];
                    player.massTotal = conf.defaultPlayerMass;
                }
                player.hue = Math.round(Math.random() * 360);
                currentPlayer = player;
                currentPlayer.lastHeartbeat = new Date().getTime();
                // global.users.push(currentPlayer);
                usersController.addUser(currentPlayer);
    
                io.emit('playerJoin', { name: currentPlayer.name });
    
                socket.emit('gameSetup', {
                    gameWidth: conf.gameWidth,
                    gameHeight: conf.gameHeight
                });
                console.log('Total players: ' + usersController.getUsersLength());
            }
    
        });
    
        socket.on('windowResized', function (data) {
            console.log(currentPlayer);
            currentPlayer.screenWidth = data.screenWidth;
            currentPlayer.screenHeight = data.screenHeight;
        });
    
        socket.on('respawn', function () {
            let users = usersController.getUsers(),
                index = util.findIndex(users, currentPlayer.id);
            if (index > -1) {
                usersController.removeUser(index);
            }
            socket.emit('welcome', currentPlayer);
            console.log('[INFO] User ' + currentPlayer.name + ' respawned!');
        });
    
        socket.on('disconnect', function () {
            let users = usersController.getUsers(),
                index = util.findIndex(users, currentPlayer.id);
            if (index > -1) {
                usersController.removeUser(index);
            }

            // console.log(currentPlayer);
            console.log('[INFO] User ' + currentPlayer.name + ' disconnected!');
    
            socket.broadcast.emit('playerDisconnect', { name: currentPlayer.name });
        });
    
        // Heartbeat function, update everytime.
        socket.on('heartbeat', function(target) {
            currentPlayer.lastHeartbeat = new Date().getTime();
            if (target.x !== currentPlayer.x || target.y !== currentPlayer.y) {
                currentPlayer.target = target;
            }
        });
    });
}