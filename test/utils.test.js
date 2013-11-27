
/**
 * Dependencies
 */

var expect = require('expect.js')
  , utils = require('../lib/utils');


describe('Utils', function() {

  describe('splace( str )', function() {

    it('splits space separated strings into `add` array', function() {
      var s = utils.splace( 'one two three' );
      expect( s.add ).to.be.an( Array );
      expect( s.add ).to.have.length( 3 );
      expect( s.add ).to.contain( 'one', 'two', 'three' );
    });

    it('puts `-` prefixed strings into `minus` array', function() {
      var s = utils.splace( 'one -two -three' );
      expect( s.minus ).to.be.an( Array );
      expect( s.minus ).to.have.length( 2 );
      expect( s.minus ).to.contain( 'two', 'three' );
    });

    it('passes through no-space string directly to `add`', function() {
      expect( utils.splace( 'hello' ).add ).to.only.contain( 'hello' );
    });

  });


  describe('isEmpty( arr )', function() {

    it('returns false if element is not an array', function() {
      expect( utils.isEmpty() ).to.be( false );
      expect( utils.isEmpty( 'str' ) ).to.be( false );
      expect( utils.isEmpty( true ) ).to.be( false );
      expect( utils.isEmpty( 1 ) ).to.be( false );
      expect( utils.isEmpty( null ) ).to.be( false );
    });

    it('returns true if array is empty', function() {
      expect( utils.isEmpty( [] ) ).to.be( true );
    });

    it('returns false if array has length', function() {
      expect( utils.isEmpty( [1] ) ).to.be( false );
    });

  });

});
