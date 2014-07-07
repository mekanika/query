
/**
 * Dependencies
 */

var expect = require( 'chai' ).expect
  , query = require( '../lib/index' )
  , convert = require( '../lib/convertids' ).convertIdConstraints;



describe('.toObject()', function() {

  it('converts ID constraints as identifiers', function () {
    var qo = query().where('id', 1).toObject();
    expect( qo ).to.have.keys( 'identifiers' );
    expect( qo.identifiers ).to.contain( 1 );
    expect( qo ).to.not.have.keys( 'constraints' );
  });

  it('converts query object to plain js object', function() {
    expect( query().toObject() ).to.not.be.an.instanceof( query.Query );
  });

  it('only populates non-empty Query properties', function() {
    expect( query().toObject() ).to.be.empty;
    expect( query().from(':)').toObject() ).to.have.key( 'resource' );
  });

  describe('removes', function() {

    it('all references to middleware', function() {
      var q = query();
      expect( q.middleware ).to.not.be.empty;
      expect( q.toObject ).to.not.have.key( 'middleware' );
    });

    it('all references to adapter', function() {
      var q = query();
      q.adapter = {whatever:true};
      expect( q.adapter ).to.not.be.empty;
      expect( q.toObject ).to.not.have.key( 'adapter' );
    });

  });

  describe('.display handling', function() {

    it('removes .display if no limit or offset', function() {
      var q = query();
      expect( q.display ).to.have.keys( 'limit', 'offset' );
      expect( q.toObject() ).to.not.have.key( 'display' );
    });

    it('removes display prop if set to 0', function() {
      var lim = query().limit(1).toObject();
      expect( lim.display ).to.have.key( 'limit' );
      expect( lim.display ).to.not.have.key( 'offset' );

      var skip = query().offset(1).toObject();
      expect( skip.display ).to.not.have.key( 'limit' );
      expect( skip.display ).to.have.key( 'offset' );
    });

  });

});


describe('Convert ID constraints', function () {

  it('method throws if !this.constraints (must .call(query))', function () {
    expect( convert ).to.throw();
  });

  it('converts single id.is() constraint', function () {
    var q = query().where('id').is('abc');
    expect( q.constraints ).to.have.length( 1 );

    convert.call( q );
    expect( q.identifiers ).to.contain( 'abc' );

    // Removes the 'id' constraint
    expect( q.constraints ).to.have.length( 0 );
  });

  it('converts multiple id.in() constraint', function () {
    var q = query().where('id').in(['abc','def']);
    expect( q.constraints ).to.have.length( 1 );

    convert.call( q );
    expect( q.identifiers ).to.contain( 'abc','def' );

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
    expect( q.identifiers ).to.contain( '123' );
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
