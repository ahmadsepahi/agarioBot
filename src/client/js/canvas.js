
var global = require('./global');

class Canvas {
    constructor(params) {
        this.cv = document.getElementById('cnvs');
        this.cv.width = global.scrWidth;
        this.cv.height = global.scrHeight;
        global.canvas = this;
    }

}

module.exports = Canvas; 