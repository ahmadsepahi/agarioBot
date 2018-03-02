var io = require('socket.io-client');
var Canvas = require('./canvas');
var global = require('./global');
var nameInput = document.getElementById('namePlayerInput');
var socket;

window.addEventListener('DOMContentLoaded', init);

function validationName() {
    var regex = /^\w*$/;
    return regex.exec(nameInput.value) !== null;
}
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
window.onload = function() {
    var btnStart = document.getElementById('butStart'),
    btnWatch = document.getElementById('butWatch'),
    nickErrorText = document.querySelector('#menuStart .input-error');
    btnStart.onclick = function () {
    
                if (validationName()) {
                    nickErrorText.style.opacity = 0;
                   // startGame('player');
                } else {
                    nickErrorText.style.opacity = 1;
                }
            };

    nameInput.addEventListener('keypress', function(data)
    {
        var key = data.keyCode;
        if (key == global.KEY_ENTER) {
            if (validationName()) {
                nickErrorText.style.opacity = 0;
               // startGame('player');
            } else {
                nickErrorText.style.opacity = 1;
            }
        }
    });
    var instructions = document.getElementById('rule');
}
