var query = require('../lib/index.js');
var expect = require('chai').expect;


describe('Updates', function() {

  var operators = ['push', 'pull', 'inc'];

  operators.forEach( function (op) {

    describe( op+'()', function () {

      it('sets action to `update`', function () {
        var q = query()[op]('skill', 1);
        expect( q.qe.action ).to.equal('update');
      });

      it('sets operator to `'+op+'`', function () {
        var q = query()[op]('skill', 1);
        expect( q.qe.updates[0].op ).to.equal( op );
      });

      it('throws if field not a string', function (done) {
        try { query()[op]( 1 ); }
        catch (e) {
          expect( e.message ).to.match( /field/ );
          done();
        }
      });

      it('sets update object', function () {
        var q = query()[op]('skill', 1);
        expect( q.qe.updates[0] ).to.eql( {field:'skill', op:op, value:1} );
      });

    });

  });

  describe('Helper .dec()', function() {

    it('sets update as `op:inc, value:-val`', function() {
      var q = query().dec( 'skill', 5 );
      expect( q.qe.updates[0].op ).to.equal( 'inc' );
      expect( q.qe.updates[0].value ).to.equal( -5 );
    });

  });

});
