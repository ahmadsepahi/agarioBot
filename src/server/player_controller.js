'use strict';

class PlayerController {
  constructor(socketID, position, radius, massTotal, cells, type, config) {
    this.id = socketID;
    this.x =  position.x;
    this.y = position.y;

    this.w = config.defaultPlayerMass;
    this.h =  config.defaultPlayerMass;

    this.cells = cells;
    this.massTotal = massTotal;

    this.hue = Math.round(Math.random() * 360);
    this.type = type;

    this.lastHeartbeat = new Date().getTime();
    this.target = { x: 0, y: 0 }
  }
}


module.exports = PlayerController;