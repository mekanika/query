var query = require('../../lib/index.js');
var expect = require('expect.js');

// Currently `query` expects an adapter() to return an `.exec()` method
var adapterStub = function() { return { exec: function(){} }};


it('should return a new query object with query()', function() {
  var q1 = query();
  var q2 = query();
  expect( q1 ).to.not.equal( q2 );
  expect( q1 ).to.be.an( 'object' );
  expect( q1 ).to.not.be.empty();
});

it('should enable setting an adapter', function() {
  // Check the adapterClass method is available
  expect( query.adapterClass ).to.be.ok();
  // Attempt to instantiate the adapter stub (will fail if not ok)
  query.adapterClass( adapterStub );
});

it('should fail setting adapter if adapterClass not provided', function() {
  // Reset our adapter class
  query.adapterClass();
  var err;
  try {
    var q = query('someinterface');
    expect(q).to.be( undefined );
  }
  catch( e ) {
    err = e;
  }
  expect( err ).to.be.an( Error );
  expect( err.message ).to.match( /requires.*adapterClass/ );
});
