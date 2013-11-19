var query = require('../lib/index.js');
var Query = require('../lib/Query');
var expect = require('expect.js');


describe('Selectors', function() {

  describe('.distinct( field )', function() {

    it('exists as a function', function() {
      expect( query().distinct ).to.be.a( Function );
    });

    it('returns the query object', function() {
      expect( query().distinct('skillz') ).to.be.a( Query );
    });

    it('fails if not provided a field', function() {
      expect( query().distinct ).to.throwError( function(e) {
        expect( e.message ).to.match( /distinct.*field/ );
      });
    });

    it('sets the query#unique property to `field`', function() {
      expect( query().distinct('moustache').unique ).to.be( 'moustache' );
    });

  });


  it('supports .count()', function() {
    expect( query().count ).to.be.a( Function );
    var q = query().count();
    expect( q.action ).to.be( 'find' );
    expect( q.selector ).to.be( 'count' );
  });

  it('supports .max( field )');

  it('supports .min( field )');

  it('enables .comment( msg ) pass-through');

  it('supports passthrough of arbitrary data (inc. code)');

  it('supports .take()');

  it('supports .first()');

  it('supports .last()');

  describe('Aggregation', function() {

    it('supports .groupBy style aggregation');

  });

});
