var io = require('socket.io-client');
var Canvas = require('./canvas');

var socket;

window.addEventListener('DOMContentLoaded', init);

function startGame() {
    if (!socket) {
        socket = io({query: 'type=alex'});
        // setupSocket(socket);
    }

    socket.on('pongcheck', function (data) {
        console.log(data, 'test');
        socket.emit('respawn', {
            my: 'data'
        });
    });
}

function init() {
    startGame();
}