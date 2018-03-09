
var global = require('./global');

class Canvas {
    constructor() {
        this.cv = document.getElementById('mycanvas');
        this.cv.width = global.scrWidth;
        this.cv.height = global.scrHeight;
        global.canvas = this;
    }

}

module.exports = Canvas; 