/*jslint bitwise: true, node: true */
'use strict';

/*
 * Авторы - Никита Кирилов, Алексей Костюченко 
 * 
 * Описание - Входной файл сервера. Здесь инициализируются все компоненты, подключаются сокеты и запускается игровой цикл.
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
var SAT = require('sat');

// Импорт настроек игры.
var c = require('../../config.json');

// Импорт инструментов.
var util = require('./lib/util');

// Import quadtree.
var quadtree = require('simple-quadtree');

var tree = quadtree(0, 0, c.gameWidth, c.gameHeight);

const GameController = require('./game_controller');
const {
    connect
} = require("./sockets");
const UsersController = require("./users_controller");

let usersController = new UsersController();
let game = new GameController();

connect(io); // Подключение сокетов.

global.sockets = {}; // Глобальный массив. Служит для хранение сокетов пользователей.

var massFood = [];
var food = [];

var V = SAT.Vector;
var C = SAT.Circle;

const initMassLog = util.log(c.defaultPlayerMass, c.slowBase);

app.use(express.static(__dirname + '/../client'));

/**
 * @description Проверка игрока.
 * @param {Object} currentPlayer текущий игрок.
 */
function tickPlayer(currentPlayer) {
    // Удаление игрока за бездействие.
    if (currentPlayer.lastHeartbeat < new Date().getTime() - c.maxHeartbeatInterval) {
        global.sockets[currentPlayer.id].emit('kick', 'Last heartbeat received over ' + c.maxHeartbeatInterval + ' ago.');
        global.sockets[currentPlayer.id].disconnect();
    }

    game.movePlayer(currentPlayer);

    function funcFood(f) {
        return SAT.pointInCircle(new V(f.x, f.y), playerCircle);
    }

    function deleteFood(f) {
        food[f] = {};
        food.splice(f, 1);
    }

    function eatMass(m) {
        if (SAT.pointInCircle(new V(m.x, m.y), playerCircle)) {
            if (m.id == currentPlayer.id && m.speed > 0 && z == m.num)
                return false;
            if (currentCell.mass > m.masa * 1.1)
                return true;
        }
        return false;
    }

    /**
     * @function Проверка пользователя (игрока) на наличие взаимодействия с другими пользователями. Если было взаимодействие, то помещаем обоих пользователей в очередь на обработку столкновения.
     * @param {Object} user Объект пользователя.
     */
    function check(user) {
        for (var i = 0; i < user.cells.length; i++) {
            if (user.cells[i].mass > 10 && user.id !== currentPlayer.id) {
                var response = new SAT.Response();
                // Проверка столкновения двух игроков.
                var collided = SAT.testCircleCircle(playerCircle,
                    new C(new V(user.cells[i].x, user.cells[i].y), user.cells[i].radius),
                    response);
                if (collided) {
                    // Если произошло столкновение, то ставим обработку их столкновения в очередь.
                    response.aUser = currentCell;
                    response.bUser = {
                        id: user.id,
                        name: user.name,
                        x: user.cells[i].x,
                        y: user.cells[i].y,
                        num: i,
                        mass: user.cells[i].mass
                    };
                    playerCollisions.push(response);
                }
            }
        }
        return true;
    }

    /**
     * @function Проверка столкновения игроков.
     * @param {*} collision столкновение
     */
    function collisionCheck(collision) {
        let users = usersController.getUsers();

        // Если у игрока 1, который наехал на игрока 2, масса и радиус больше, то игрок 2 считается съеденным.
        if (collision.aUser.mass > collision.bUser.mass * 1.1 && collision.aUser.radius > Math.sqrt(Math.pow(collision.aUser.x - collision.bUser.x, 2) + Math.pow(collision.aUser.y - collision.bUser.y, 2)) * 1.75) {
            console.log('[DEBUG] Killing user: ' + collision.bUser.id);
            console.log('[DEBUG] Collision info:');
            var numUser = util.findIndex(users, collision.bUser.id); // Ищем индекс съеденного игрока.
            if (numUser > -1) {
                if (users[numUser].cells.length > 1) { // Если массив копий не пустой.
                    users[numUser].massTotal -= collision.bUser.mass; // Отнимаем массу от общей массы.
                    users[numUser].cells.splice(collision.bUser.num, 1); // Убираем игрока и массива окружения.
                } else {
                    usersController.removeUser(numUser); // Удляем игрока из списка пользователей.
                    // Сообщаем игроку 2, что его съели.
                    io.emit('playerDied', {
                        name: collision.bUser.name
                    });

                    // Отсылаем всем другим игрокам о смерте игрока 2
                    global.sockets[collision.bUser.id].emit('RIP');
                }
            }

            // Игрок 1 после съедения игрока 2 получает его массу.
            currentPlayer.massTotal += collision.bUser.mass;
            collision.aUser.mass += collision.bUser.mass;
        }
    }

    // Просматриваем копии игрока
    for (var z = 0; z < currentPlayer.cells.length; z++) {

        var currentCell = currentPlayer.cells[z];
        var playerCircle = new C(
            new V(currentCell.x, currentCell.y),
            currentCell.radius
        );

        // Формируем массив съеденной еды
        var foodEaten = food.map(funcFood)
            .reduce(function (a, b, c) {
                return b ? a.concat(c) : a;
            }, []);

        // Удаляем съеденную еду из общего массива еды
        foodEaten.forEach(deleteFood);

        // Считаем, сколько прибавили в массе
        var massEaten = massFood.map(eatMass)
            .reduce(function (a, b, c) {
                return b ? a.concat(c) : a;
            }, []);

        var masaGanada = 0;
        for (var m = 0; m < massEaten.length; m++) {
            masaGanada += massFood[massEaten[m]].masa;
            massFood[massEaten[m]] = {};
            massFood.splice(massEaten[m], 1);
            for (var n = 0; n < massEaten.length; n++) {
                if (massEaten[m] < massEaten[n]) {
                    massEaten[n]--;
                }
            }
        }

        if (typeof (currentCell.speed) == "undefined")
            currentCell.speed = 6.25;
        // Переопределение массы и скорости игрока
        masaGanada += (foodEaten.length * c.foodMass);
        currentCell.mass += masaGanada;
        currentPlayer.massTotal += masaGanada;
        currentCell.radius = util.massToRadius(currentCell.mass);
        playerCircle.r = currentCell.radius;

        tree.clear();
        let users = usersController.getUsers();

        users.forEach(tree.put);
        var playerCollisions = [];

        users.forEach(user => {
            check(user)
        });
        playerCollisions.forEach(collisionCheck);
    }
}

function moveloop() {
    let users = usersController.getUsers();
    users.forEach(user => {
        tickPlayer(user);
    });
}

function gameloop() {
    let users = usersController.getUsers();
    if (users.length > 0) {
        users.sort(function (a, b) {
            return b.massTotal - a.massTotal;
        });

        users.forEach(user => {
            user.cells.forEach(cell => {
                if (cell.mass * (1 - (c.massLossRate / 1000)) > c.defaultPlayerMass && user.massTotal > c.minMassLoss) {
                    let massLoss = cell.mass * (1 - (c.massLossRate / 1000));
                    user.massTotal -= cell.mass - massLoss;
                    cell.mass = massLoss;
                }
            });
        });
    }

    game.balanceMass(users, food);
}

// Отправка обновлений игроку
function sendUpdates() {
    let users = usersController.getUsers();
    users.forEach(function (u) {
        // center the view if x/y is undefined, this will happen for spectators
        u.x = u.x || c.gameWidth / 2;
        u.y = u.y || c.gameHeight / 2;

        var visibleFood = food
            .map(function (f) {
                if (f.x > u.x - u.screenWidth / 2 - 20 &&
                    f.x < u.x + u.screenWidth / 2 + 20 &&
                    f.y > u.y - u.screenHeight / 2 - 20 &&
                    f.y < u.y + u.screenHeight / 2 + 20) {
                    return f;
                }
            })
            .filter(function (f) {
                return f;
            });

        var visibleMass = massFood
            .map(function (f) {
                if (f.x + f.radius > u.x - u.screenWidth / 2 - 20 &&
                    f.x - f.radius < u.x + u.screenWidth / 2 + 20 &&
                    f.y + f.radius > u.y - u.screenHeight / 2 - 20 &&
                    f.y - f.radius < u.y + u.screenHeight / 2 + 20) {
                    return f;
                }
            })
            .filter(function (f) {
                return f;
            });

        var visibleCells = users
            .map(function (user) {
                let cell = user.cells[0]
                if (cell.x + cell.radius > u.x - u.screenWidth / 2 - 20 &&
                    cell.x - cell.radius < u.x + u.screenWidth / 2 + 20 &&
                    cell.y + cell.radius > u.y - u.screenHeight / 2 - 20 &&
                    cell.y - cell.radius < u.y + u.screenHeight / 2 + 20) {
                    if (user.id !== u.id) {
                        return {
                            id: user.id,
                            x: user.x,
                            y: user.y,
                            cells: user.cells,
                            massTotal: Math.round(user.massTotal),
                            hue: user.hue,
                            name: user.name
                        };
                    } else {
                        return {
                            x: user.x,
                            y: user.y,
                            cells: user.cells,
                            massTotal: Math.round(user.massTotal),
                            hue: user.hue,
                        };
                    }
                }
            })
            .filter(function (user) {
                return user;
            });

        global.sockets[u.id].emit('serverTellPlayerMove', visibleCells, visibleFood, visibleMass);
    });
}

// Периодичность, с которой срабатывают циклы игры
setInterval(moveloop, 600 / 60);
setInterval(gameloop, 600);
setInterval(sendUpdates, 600 / c.networkUpdateFactor);

// Don't touch, IP configurations.
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || c.host;
var serverport = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || c.port;
exports.server = http.listen(serverport, ipaddress, function () {
    console.log('[DEBUG] Listening on ' + ipaddress + ':' + serverport);
});
