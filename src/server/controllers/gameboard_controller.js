'use strict';

class GameboardController
{
  constructor(sockets, users) {
    this.sockets = sockets;
    this.getSockets = function() { return this.sockets; }
    this.setSockets = function(sockets) { this.sockets = sockets; }

    this.users = users;
    this.getUsers = function() { return this.users; }
    this.setUsers = function(users) { this.users = users; }
  }


  


  sendUpdates() {

  }
}

module.exports = GameboardController;