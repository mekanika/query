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
    it('sets a single `fields` when passed a string', function() {
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

    it('applies an array of fields to `this.fields`', function() {
      var q = query().select( [1,2,3] );
      expect( q.fields ).to.have.length( 3 );
      expect( q.fields ).to.only.contain( 1,2,3 );
    });

    it('applies space separated string as multiple fields', function() {
      var q = query().select( '1 2 3' );
      expect( q.fields ).to.have.length( 3 );
      expect( q.fields ).to.only.contain( '1','2','3' );
    });

    it('applies negative strings as excludes', function() {
      expect( query().select( '-hi' ).excludeFields ).to.only.contain( 'hi' );
      expect( query().select( 'sup -hi' ).excludeFields ).to.only.contain( 'hi' );
    });

    it('sets to null if passed null (special case)', function() {
      var q = query().select( null );
      expect( q.fields ).to.be( null );
    });
  });


  describe('.exclude( fields )', function() {

    it('applies array of fields to .excludeFields array', function() {
      var q = query().exclude( ['name', '!'] );
      expect( q.excludeFields ).to.have.length( 2 );
      expect( q.excludeFields ).to.contain( 'name', '!' );
    });

    it('passes single string onto excludes', function() {
      var q = query().exclude( 'name' );
      expect( q.excludeFields ).to.have.length( 1 );
      expect( q.excludeFields ).to.contain( 'name' );
    });

    it('applies space separated string as multiple onto excludes', function() {
      var q = query().exclude( 'name !' );
      expect( q.excludeFields ).to.have.length( 2 );
      expect( q.excludeFields ).to.contain( 'name', '!' );
    });

    it('throws error if not provided Array or String', function() {
      var err;
      try {
        query().exclude( 123 );
      }
      catch( e ) { err = e; }
      expect( err ).to.be.an( Error );
    });

  });


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


});
