
var global = require('./global');

class Canvas {
  constructor() {

    this.cv = document.getElementById('mycanvas');
    this.cv.width = global.scrWidth;
    this.cv.height = global.scrHeight;

    window.addEventListener('keypress', this.movement, false);

    global.canvas = this;
  }

  movement(event) {
    let keyCode = event.keyCode;

    if (keyCode === global.KEY_UP) {
      window.canvas.socket.emit('moveUp', 'up');
    }
    else if (keyCode === global.KEY_DOWN) {
      window.canvas.socket.emit('moveDown', 'down');
    }
    else if (keyCode === global.KEY_RIGHT) {
      window.canvas.socket.emit('moveRight', 'right');
    }
    else if (keyCode === global.KEY_LEFT) {
      window.canvas.socket.emit('moveLeft', 'left');
    }
  }

}

module.exports = Canvas; 