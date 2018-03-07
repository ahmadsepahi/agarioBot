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
function startGame(type) {
    global.playerName = nameInput.value.replace(/(<([^>]+)>)/ig, '').substring(0,30);
    global.typePlayer = type;
    global.scrWidth = window.innerWidth;
    global.scrHeight = window.innerHeight;
    document.getElementById('MenuWr').style.maxHeight = '0px';
      
    document.getElementById('gameArea').style.opacity = 1;
    if (!socket) {
        socket = io({
            query: 'type=' + type
        });
        
        // setupSocket(socket);
    }
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
                    startGame('player');
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
                startGame('player');
            } else {
                nickErrorText.style.opacity = 1;
            }
        }
    });
    var instructions = document.getElementById('rule');
}

window.Canvas = new Canvas();
var c = window.canvas.cv;
var graphic = c.getContext('2d');
