var query = require('../lib/index.js');
var expect = require('expect.js');

describe('Sorting methods', function() {

  beforeEach( function(){
    query.reset();
  });


  describe('.asc( index )', function() {

    it('adds an ascending sort object', function() {
      expect( query().asc().sort[0].direction ).to.be( 'asc' );
      expect( query().asc('smoo').sort[0].index ).to.be( 'smoo' );
    });

    it('optionally uses index', function() {
      expect( query().asc().sort ).to.not.have.keys( 'index' );
    });
  });


  describe('.desc( index )', function() {

    it('adds a descending sort object', function() {
      expect( query().desc().sort[0].direction ).to.be( 'desc' );
      expect( query().desc('smoo').sort[0].index ).to.be( 'smoo' );
    });

    it('optionally uses index', function() {
      expect( query().desc().sort ).to.not.have.keys( 'index' );
    });

  });


  describe('.order( index )', function() {

    it('sets the most recent sort object index', function() {
      var q = query().asc();
      expect( q.sort[0] ).to.not.have.keys( 'index' );
      q.order('name');
      expect( q.sort[0].index ).to.be( 'name' );
    });

    it('creates a sort object with `index` if none existing', function() {
      var q = query();
      expect( q.sort ).to.have.length( 0 );
      expect( q.order('cool').sort ).to.have.length( 1 );
      expect( q.sort[0] ).to.not.have.keys( 'direction' );
    })

  });


  describe('multiple indeces', function() {

    it('methods should add to sort queue', function() {
      var q = query().asc('name').desc('price');
      expect( q.sort ).to.have.length( 2 );
    });

  });

});
