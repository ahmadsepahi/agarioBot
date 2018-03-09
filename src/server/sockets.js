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
    socket.on('heartbreak', function(target) {
        console.log(currentPlayer);
        currentPlayer.updateLastHeartbeat();

        if (target.x !== currentPlayer.targetX || target.y !== currentPlayer.targetY) {
            currentPlayer.targetX = target.x;
            currentPlayer.targetY = target.y;
        }
    });

    socket.on('moveUp', function(direction) {
      console.log('[INFO]: direction chagned - ', direction, socket.id);
    })

    socket.on('moveDown', function(direction) {
      console.log('[INFO]: direction changed - ', direction, socket.id);
    });

    socket.on('moveRight', function(direction) {
      console.log('[INFO]: direction changed - ', direction, socket.id);
    });

    socket.on('moveLeft', function(direction) {
      console.log('[INFO]: direction changed - ', direction, socket.id);
    });

    socket.on('kick', function() {
      //
    });

    socket.on('disconnect', function () {});
}