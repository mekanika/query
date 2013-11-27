
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

});
