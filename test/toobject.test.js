
/**
 * Dependencies
 */

var expect = require( 'expect.js' )
  , query = require( '../lib/index' )
  , convert = require( '../lib/convertids' ).convertIdConstraints;



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
