
/**
 * Dependencies
 */

var expect = require('chai').expect
  , utils = require('../lib/utils');


describe('Utils', function() {

  describe('splace( str )', function() {

    it('splits space separated strings into `add` array', function() {
      var s = utils.splace( 'one two three' );
      expect( s.add ).to.be.an.instanceof( Array );
      expect( s.add ).to.have.length( 3 );
      expect( s.add ).to.contain( 'one', 'two', 'three' );
    });

    it('puts `-` prefixed strings into `minus` array', function() {
      var s = utils.splace( 'one -two -three' );
      expect( s.minus ).to.be.an.instanceof( Array );
      expect( s.minus ).to.have.length( 2 );
      expect( s.minus ).to.contain( 'two', 'three' );
    });

    it('passes through no-space string directly to `add`', function() {
      expect( utils.splace( 'hello' ).add ).to.contain( 'hello' );
    });

  });


  describe('isEmpty( el )', function() {

    it('returns `true` on undefined or null', function () {
      expect( utils.isEmpty( undefined ) ).to.equal( true );
      expect( utils.isEmpty( null ) ).to.equal( true );
    });

    it('returns `true` on an empty string', function () {
      expect( utils.isEmpty( '' ) ).to.equal( true );
    });

    it('returns true if array is empty', function() {
      expect( utils.isEmpty( [] ) ).to.equal( true );
    });

    it('returns false if array has length', function() {
      expect( utils.isEmpty( [1] ) ).to.equal( false );
    });

    it('returns `true` for an empty Object {}', function() {
      expect( utils.isEmpty( {} ) ).to.equal( true );
    });

    it('returns false for any other elements', function() {
      expect( utils.isEmpty( 'str' ) ).to.equal( false );
      expect( utils.isEmpty( true ) ).to.equal( false );
      expect( utils.isEmpty( 1 ) ).to.equal( false );
    });

  });


  describe('has( arr, val )', function() {

    it('returns true if val is in arr', function() {
      expect( utils.has( [1,'2', 4], '2' ) ).to.equal( true );
    });

    it('returns false if val is not in arr', function() {
      expect( utils.has( [1,'2', 4], 2 ) ).to.equal( false );
    });

    it('falls back if no .indexOf', function() {
      var a = [1,2,3];
      a.indexOf = undefined;
      expect( utils.has( a, 2 ) ).to.equal( true );
      expect( utils.has( a, ':)' ) ).to.equal( false );
    });

  });

});
