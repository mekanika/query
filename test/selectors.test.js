var query = require('../lib/index.js');
var Query = require('../lib/Query');
var expect = require('expect.js');


describe('Selectors', function() {

  describe('.distinct( field )', function() {

    it('should exist as a function', function() {
      expect( query().distinct ).to.be.a( Function );
    });

    it('should return the query object', function() {
      expect( query().distinct('skillz') ).to.be.a( Query );
    });

    it('should fail if not provided a field', function() {
      expect( query().distinct ).to.throwError( function(e) {
        expect( e.message ).to.match( /distinct.*field/ );
      });
    });

    it('should set the query#unique property to `field`', function() {
      expect( query().distinct('moustache').unique ).to.be( 'moustache' );
    });

  });


  it('should support .count()', function() {
    expect( query().count ).to.be.a( Function );
    var q = query().count();
    expect( q.action ).to.be( 'find' );
    expect( q.selector ).to.be( 'count' );
  });

  it('should support .max( field )');

  it('should support .min( field )');

  it('should enable .comment( msg ) pass-through');

  it('should support passthrough of arbitrary data (inc. code)');

  it('should support .take()');

  it('should support .first()');

  it('should support .last()');

  describe('Aggregation', function() {

    it('should support .groupBy style aggregation');

  });

});
