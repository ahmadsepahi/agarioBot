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
    while (toRemove--) {
      food.pop();
    }

    return food;
  }

  balanceMass(users, food) {
    let usersMass = users.map(user => { return user.massTotal; }).reduce((prev,current) => { return prev + current; }, 0);
    let totalMass = food.length * config.foodMass + usersMass;
        

    let massDelta = config.gameMass - totalMass;
    let maxFoodDelta = config.maxFood - food.length;
    let foodDelta = parseInt(massDelta / config.foodMass) - maxFoodDelta;
    
    let foodToAdd = Math.min(foodDelta, maxFoodDelta);
    let foodToRemove = -Math.max(foodDelta, maxFoodDelta);

    if (foodToAdd > 0) {
      this.addFood(food, foodToAdd);
    }
    else if (foodToRemove > 0) {
      this.removeFood(food, foodToRemove);
    }
  }
}

module.exports = GameController;