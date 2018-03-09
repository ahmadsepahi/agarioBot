var io = require('socket.io-client');
var Canvas = require('./canvas');
var global = require('./global');
var nameInput = document.getElementById('namePlayerInput');
var socket;

//window.addEventListener('DOMContentLoaded', init);
function validationName() {
    var regex = /^\w*$/;
    console.log(nameInput.value);
    return regex.exec(nameInput.value) !== null;
}
function startGame(type) {
    console.log("Ok1");
    global.playerName = nameInput.value.replace(/(<([^>]+)>)/ig, '').substring(0,30);
    global.typePlayer = type;
    global.scrWidth = window.innerWidth;
    global.scrHeight = window.innerHeight;
    document.getElementById('MenuWr').style.maxHeight = '0px';
    console.log("Ok4");
    document.getElementById('gameArea').style.opacity = 1;
    console.log("Ok3");
    if (!socket) {
        console.log("Ok2");
        socket = io({
            query: 'type=' + type
        });
        
        setSocket(socket);
    }
    if (!global.animationPlayMain)
        animationPlayMain();
    window.canvas.socket = socket;
    global.socket = socket;
}

// function init() {
//     startGame();
// }
window.onload = function() {
    console.log("Ok7");
    var btnStart = document.getElementById('butStart'),
        btnWatch = document.getElementById('butWatch'),
        nickErrorText = document.querySelector('#menuStart .input-error');
    btnStart.onclick = function () {
        console.log("Ok5");
                if (validationName()) {
                    nickErrorText.style.opacity = 0;
                    console.log("Ok6");
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


window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.msRequestAnimationFrame     ||
            function( callback ) {
                window.setTimeout(callback, 1000 / 60);
            };
})();
function animationPlay() {
    global.animationPlayMain = window.requestAnimFrame(animationPlay);
    playLoop();
}
function playLoop() {
    if (!global.disconnect) {
        if (global.gameStart) {
            graph.fillStyle = global.backgroundColor;
            graph.fillRect(0, 0, global.screenWidth, global.screenHeight);

            //drawgrid();
           

        } 
        }
}
function setSocket(socket){
    socket.on('gameSetup', function(data) {
        global.gameWidth = data.gameWidth;
        global.gameHeight = data.gameHeight;
    });
}