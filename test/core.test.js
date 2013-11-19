var query = require('../lib/index.js');
var expect = require('expect.js');

// Currently `query` expects an adapter() to return an `.exec()` method
var adapterStub = function() { return { exec: function(){} }; };


describe('query Core', function() {


  beforeEach( function(){
    query.reset();
  });

  it('exports the Query constructor as query.Query', function() {
    expect( query.Query ).to.be.a( Function );
  });

  it('return a new query object with query()', function() {
    var q1 = query();
    var q2 = query();
    expect( q1 ).to.not.equal( q2 );
    expect( q1 ).to.be.an( 'object' );
    expect( q1 ).to.not.be.empty();
  });

  // This checks that our stub provides the methods required by our lib
  it('provides an .exec() method on adapterClass', function() {
    expect( adapterStub().exec ).to.be.a( Function );
  });

  it('enables setting an .adapterClass( class )', function() {
    // Check the adapterClass method is available
    expect( query.adapterClass ).to.be.ok();
    // Attempt to instantiate the adapter stub (will fail if not ok)
    query.adapterClass( adapterStub );
  });

  it('returns query class on setting .adapterClass()', function() {
    var q = query.adapterClass( adapterStub );
    expect( q ).to.be.a( Function );
  });

  it('sets an adapter using .use(\'adapter\')', function() {
    query.adapterClass( adapterStub );
    var q = query().use('whatever');
    expect( q.adapter.exec ).to.be.a( Function );
  });

  it('fails to .use( adapterKey ) if no adapterClass', function() {
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

  it('sets an adapter if initialised as query( adapter )', function() {
    var q = query( adapterStub );
    expect( q.adapter ).to.be.ok();
  });

  it('sets an adapter if passed .useAdapter( adapter )', function() {
    var q = query().useAdapter( adapterStub );
    expect( q.adapter ).to.be.ok();
  });


  describe('.from(resource)', function() {
    it('sets the resource when provided', function() {
      var q = query().from('icecream');
      expect( q.resource ).to.be( 'icecream' );
    });

    it('fail to set resource if not provided string', function() {
      var err;
      try {
        var q = query().from( ['array'] );
        expect(q).to.be( undefined );
      }
      catch( e ) { err = e; }

      expect( err ).to.be.an( Error );
      expect( err.message ).to.match( /resource.*string/ );
    });
  });


  describe('.select(fields)', function() {
    it('sets single `fields` on .select(fields)', function() {
      var q = query().select('id');
      expect( q.fields ).to.have.length(1);
      expect( q.fields[0] ).to.be( 'id' );
    });

    it('fails .select(fields) if no fields passed', function() {
      var err;
      try {
        var q = query().select();
        expect(q).to.be( undefined );
      }
      catch(e) {
        err = e;
      }
      expect( err ).to.be.an( Error );
      expect( err.message ).to.match( /select.*fields/ );
    });

    it('shallow decomposes array and literal `fields`', function() {
      var q = query().select( '1', ['2', '3'], ['4'] );
      expect( q.fields ).to.have.length( 4 );
      expect( q.fields ).to.eql( ['1', '2', '3', '4'] );
    });
  });


});
