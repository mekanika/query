/*eslint-env node, mocha */
var query = require('../lib/index.js');
var expect = require('chai').expect;

describe('Updates', function () {
  var operators = ['push', 'pull', 'inc'];

  operators.forEach(function (op) {
    describe(op + '()', function () {
      it('sets action to `update`', function () {
        var q = query()[op]('skill', 1);
        expect(q.qe.action).to.equal('update');
      });

      it('sets operator to `' + op + '`', function () {
        var q = query()[op]('skill', 1);
        expect(q.qe.updates[0].skill).to.have.key(op);
      });

      it('throws if field not a string', function (done) {
        try { query()[op](1); } catch (e) {
          expect(e.message).to.match(/field/);
          done();
        }
      });

      it('sets update object', function () {
        var q = query()[op]('skill', 1);
        var mod = {}; mod[op] = 1;
        var uo = {skill: mod};
        expect(q.qe.updates[0]).to.eql(uo);
      });

    });

  });

  describe('Helper .dec()', function () {
    it('sets update as `op:inc, value:-val`', function () {
      var q = query().dec('skill', 5);
      expect(q.qe.updates[0].skill).to.have.key('inc');
      expect(q.qe.updates[0].skill.inc).to.equal(-5);
    });

  });

});
