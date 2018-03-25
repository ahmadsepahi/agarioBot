'use strict';

let users = [];


class UserController {
  getUsers() {
    return users;
  }

  addUser(user) {
    users.push(user);
  }

  getUsersLength() {
    return users.length;
  }

  removeUser(index) {
    users.splice(index, 1);
  }
}


module.exports = UserController;