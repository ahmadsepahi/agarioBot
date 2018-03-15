'use strict';

const config = require('../../config.json');
const utils = require('./lib/util');

class GameController {
  constructor() {
  }

  addFood(food, toAdd) {
    let radius = utils.massToRadius(config.foodMass);

    while (toAdd--) {
      let position = config.foodUniformDisposition ? utils.uniformPosition(food, radius) : util.randomPosition(radius);
      
      food.push({
        id: ((new Date()).getTime() + '' + food.length) >>> 0,
        x: position.x,
        y: position.y,
        radius: radius,
        mass: Math.random() + 2,
        hue: Math.round(Math.random() * 360)
      });
    }

    return food;
  }

  removeFood(food, toRemove) {
    while (toRem--) {
      food.pop();
    }

    return food;
  }
}

module.exports = GameController;