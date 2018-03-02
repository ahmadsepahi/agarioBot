var io = require('socket.io-client');
var Canvas = require('./canvas');

var socket;

addEventListener('DOMContentLoaded', 'init');

function startGame() {
    if(!socket) {
        socket = io({query:"type=" + player});
        console.log(socket);
        setupSocket(socket);
    }
    socket.emit('respawn');
}

function init() {
    startGame();
}