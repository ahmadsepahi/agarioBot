
var global = require('./global');

class Canvas {
  constructor() {
 constructor(params) {
        this.directionLock = false;
        this.target = global.target;
        this.reenviar = true;
        this.socket = global.socket;
        this.directions = [];
        var self = this;

        this.cv = document.getElementById('cvs');
        this.cv.width = global.screenWidth;
        this.cv.height = global.screenHeight;
      
        this.cv.addEventListener('keypress', this.keyInput, false);
        this.cv.addEventListener('keyup', function(event) {
            self.reenviar = true;
            self.directionUp(event);
        }, false);
        this.cv.addEventListener('keydown', this.directionDown, false);
        this.cv.parent = self;
        global.canvas = this;
    }
  // Срабатывает при изменении направления
    directionDown(event) {
    	var key = event.which || event.keyCode;
        var self = this.parent; //для того, чтобы мы не использовали объект cv
    	if (self.directional(key)) {
    		self.directionLock = true;
    		if (self.newDirection(key, self.directions, true)) {
    			self.updateTarget(self.directions);
    			self.socket.emit('heartbeat', self.target);
    		}
    	}
    }

    // Срабатывает при изменении направления
    directionUp(event) {
    	var key = event.which || event.keyCode;
    	if (this.directional(key)) { 
    		if (this.newDirection(key, this.directions, false)) {
    			this.updateTarget(this.directions);
    			if (this.directions.length === 0) this.directionLock = false;
    			this.socket.emit('heartbeat', this.target);
    		}
    	}
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