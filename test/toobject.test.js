
/**
 * Dependencies
 */

var expect = require( 'expect.js' )
  , query = require( '../lib/index' )
  , convert = require( '../lib/convertids' ).convertIdConstraints;



describe('.toObject()', function() {

  it('converts query object to plain js object', function() {
    expect( query().toObject() ).to.not.be.a( query.Query );
  });

  it('only populates non-empty Query properties', function() {
    expect( query().toObject() ).to.be.empty();
    expect( query().from(':)').toObject() ).to.only.have.keys( 'resource' );
  });

  describe('removes', function() {

    it('all references to middleware', function() {
      var q = query();
      expect( q.middleware ).to.not.be.empty();
      expect( q.toObject ).to.not.have.keys( 'middleware' );
    });

    it('all references to adapter', function() {
      var q = query();
      q.adapter = {whatever:true};
      expect( q.adapter ).to.not.be.empty();
      expect( q.toObject ).to.not.have.keys( 'adapter' );
    });

  });

  describe('.display handling', function() {

    it('removes .display if no limit or offset', function() {
      var q = query();
      expect( q.display ).to.have.keys( 'limit', 'offset' );
      expect( q.toObject() ).to.not.have.keys( 'display' );
    });

    it('removes display prop if set to 0', function() {
      var lim = query().limit(1).toObject();
      expect( lim.display ).to.have.keys( 'limit' );
      expect( lim.display ).to.not.have.keys( 'offset' );

      var skip = query().offset(1).toObject();
      expect( skip.display ).to.not.have.keys( 'limit' );
      expect( skip.display ).to.have.keys( 'offset' );
    });

  });

});


describe('Convert ID constraints', function () {

  it('method throws if !this.constraints (must .call(query))', function () {
    expect( convert ).to.throwError();
  });

  it('converts single id.is() constraint', function () {
    var q = query().where('id').is('abc');
    expect( q.constraints ).to.have.length( 1 );

    convert.call( q );
    expect( q.identifiers ).to.only.contain( 'abc' );

    // Removes the 'id' constraint
    expect( q.constraints ).to.have.length( 0 );
  });

  it('converts multiple id.in() constraint', function () {
    var q = query().where('id').in(['abc','def']);
    expect( q.constraints ).to.have.length( 1 );

    convert.call( q );
    expect( q.identifiers ).to.only.contain( 'abc','def' );

    // Removes the 'id' constraint
    expect( q.constraints ).to.have.length( 0 );
  });

  it('ignores any `id.{operator}` not `eq` or `in`', function () {
    var q = query()
      .where('id', '123') // Convert
      .where('id').nin([44,55]) // Ignore
      .where('id').gte( 5541 ); // Ignore

    convert.call( q );
    expect( q.constraints ).to.have.length( 2 );
    expect( q.identifiers ).to.only.contain( '123' );
  });

  it('uses query.idField or `id` as constraint field', function () {
    var q = query().where('smoo').in(['abc','def']);
    convert.call( q );
    expect( q.constraints ).to.have.length( 1 );
    expect( q.identifiers ).to.have.length( 0 );

    q.idField = 'smoo';
    convert.call( q );
    expect( q.constraints ).to.have.length( 0 );
    expect( q.identifiers ).to.contain( 'abc', 'def' );
  });

});
