var io = require('socket.io-client');
var Canvas = require('./canvas');

var socket;

window.addEventListener('DOMContentLoaded', init);

function startGame() {
    if(!socket) {
        socket = io('http://localhost');
        // setupSocket(socket);
    }
    console.log('test');
    socket.on('respawn');
}

function init() {
    startGame();
}