/*jshint expr:true */

var expect = require('chai').expect,
    util   = require('../src/server/lib/util');

describe('util.js', function () {

  describe('#massToRadius', function () {

    it('should return non-zero radius on zero input', function () {
      var r = util.massToRadius(0);
      expect(r).to.be.a('number');
      expect(r).to.equal(4);
    });

    it('should convert masses to a circle radius', function () {
      var r1 = util.massToRadius(4),
          r2 = util.massToRadius(16),
          r3 = util.massToRadius(1);

      expect(r1).to.equal(16);
      expect(r2).to.equal(28);
      expect(r3).to.equal(10);
    });
  });
});
