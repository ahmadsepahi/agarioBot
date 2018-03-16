'use strict';

const config = require('../../config.json');
const util = require('./lib/util');

const initMassLog = util.log(config.defaultPlayerMass, config.slowBase);

class GameController {
  constructor() {}

  movePlayer(player) {
    let x = 0; 
    let y = 0;

    player.cells.forEach((cell, i) => {
      let target = {
        x: player.x - cell.x + player.target.x,
        y: player.y - cell.y + player.target.y
      };

      // just vector distance
      let distance = Math.sqrt(Math.pow(target.y, 2) + Math.pow(target.x, 2));
      // just angel between vectors
      let deg = Math.atan2(target.y, target.x);

      // must slow down small players for balance sake
      let slowdown;
      cell.speed <= 6.25 ? slowdown = util.log(cell.mass, config.slowBase) - initMassLog + 1 : slowdown = 1;

      let deltaY = cell.speed * Math.sin(deg) / slowdown;
      let deltaX = cell.speed * Math.cos(deg) / slowdown;

      if (cell.speed > 6.25) {
        cell.speed -= 0.5;
      }
      if (distance < (50 + cell.radius)) {
        deltaY *= distance / (50 + cell.radius);
        deltaX *= distance / (50 + cell.radius);
      }
      if (!isNaN(deltaY)) {
        cell.y += deltaY;
      }
      if (!isNaN(deltaX)) {
        cell.x += deltaX;
      }

      // TODO calculate position change
      // TODO calculate borders change
    });

    player.x = x / player.cells.length;
    player.y = y / player.cells.length;
  }

  addFood(food, toAdd) {
    let radius = util.massToRadius(config.foodMass);

    while (toAdd--) {
      let position = config.foodUniformDisposition ? util.uniformPosition(food, radius) : util.randomPosition(radius);
      
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