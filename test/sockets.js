/*jshint expr:true */

var expect = require('chai').expect,
    io = require('socket.io-client'),
    options = {
        transports: ['websocket'],
        forceNew: true,
        reconnection: false
    };
require('../src/server/server');

var socketURL = 'http://localhost:3000';

var user = {
    'name': 'Alex',
    'type': 'player',
    'target': {
        'x': 0,
        'y': 0
    }
};

describe("Socket.io", function () {

    /* Test 1 - Check connection to server. */
    it('Should recieve pongcheck message from server', function (done) {
        var client = io.connect(socketURL, options);

        client.on('connect', function () {
            client.emit('pingcheck');
        });

        client.on('pongcheck', function () {
            client.disconnect();
            done();
        });
    });

    /* Test 2 - Check connection user to the server. */
    it('Should recieve object with name of connected client', function (done) {
        var client = io.connect(socketURL, options);

        client.on('connect', function () {
            client.emit('gotit', user);
        });

        client.on('playerJoin', function (obj) {
            expect(obj).to.be.a('object');
            expect(obj.name).to.be.a('string');
            expect(obj.name).to.equal(user.name);
            client.disconnect();
            done();
        });
    });

    /* Test 3 - Check disconnection user from the server. */
    it('Should recieve object with name of diconnected client', function (done) {
        var client = io.connect(socketURL, options);
        var client2 = io.connect(socketURL, options);

        client.on('connect', function () {
            client.emit('gotit', user);
            setTimeout(() => {
                client.disconnect()
            }, 40);
        });

        client2.on('playerDisconnect', function (obj) {
            expect(obj).to.be.a('object');
            expect(obj.name).to.be.a('string');
            expect(obj.name).to.equal(user.name);
            client2.disconnect();
            done();
        });
    });

    /* Test 4 - Check respawning user. */
    it('Should recieve object with name of respawned client', function (done) {
        var client = io.connect(socketURL, options);

        client.on('connect', function () {
            client.emit('gotit', user);
            setTimeout(() => {
                client.emit('respawn');
            }, 40);
        });

        client.on('welcome', function (obj) {
            expect(obj).to.be.a('object');
            expect(obj.name).to.be.a('string');
            expect(obj.name).to.equal(user.name);
            client.disconnect();
            done();
        });
    });
});
