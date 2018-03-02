var io = require('socket.io-client');
var Canvas = require('./canvas');

var socket;

window.addEventListener('DOMContentLoaded', init);

function startGame(type) {
    if (!socket) {
        socket = io({
            query: 'type=' + type
        });
        // setupSocket(socket);
    }
}

function init() {
    startGame('player');
}