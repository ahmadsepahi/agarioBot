'use strict';

const socketio = require('socket.io');

// const util = require('./lib/util');

exports.connect = function (http, callback) {
    const io = socketio(http);
    io.on('connection', function (socket) {
        callback(io, socket);
    });
}

exports.handleAction = function (io, socket, currentPlayer) {    
    socket.on('pingcheck', function () {
        socket.emit('pongcheck');
    });

    socket.on('gotit', function (player) {
        console.log('[INFO] Player ' + player.name + ' connecting!');
    });

    socket.on('windowResized', function (data) {
        currentPlayer.screenWidth = data.screenWidth;
        currentPlayer.screenHeight = data.screenHeight;
    });

    socket.on('respawn', function () {
        console.log('kek');
    });

    socket.on('disconnect', function () {});

    socket.on('pass', function (data) {});
}