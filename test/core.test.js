var query = require('../lib/index.js');
var expect = require('chai').expect;

// Currently `query` expects an adapter() to return an `.exec()` method
var adapterStub = { exec: function(){} };


describe('query Core', function() {

  it('exports the Query constructor as query.Query', function() {
    expect( query.Query ).to.be.an.instanceof( Function );
  });

  it('return a new query object with query()', function() {
    var q1 = query();
    var q2 = query();
    expect( q1 ).to.not.equal( q2 );
    expect( q1 ).to.be.an.instanceof( query.Query );
    expect( q1 ).to.not.be.empty;
  });

  it('sets an adapter if initialised as query( adapter )', function() {
    var q = query( adapterStub );
    expect( q.adapter ).to.be.ok;
  });

  it('sets an adapter if passed .useAdapter( adapter )', function() {
    var q = query().useAdapter( adapterStub );
    expect( q.adapter ).to.be.ok;
  });

  it('throws if .useAdapter(adapter) has no .exec method', function() {
    var err;
    try {
      var q = query('someinterface');
    }
    catch( e ) {
      err = e;
    }
    expect( err ).to.be.an.instanceof( Error );
    expect( err.message ).to.match( /invalid.*adapter/i );
  });


  describe('.from(resource)', function() {
    it('aliases as .resource()', function () {
      expect( query().resource('jam').qo.resource ).to.equal('jam');
    });

    it('sets the resource when provided', function() {
      var q = query().from('icecream');
      expect( q.qo.resource ).to.equal( 'icecream' );
    });

    it('fail to set resource if not provided string', function() {
      var err;
      try {
        var q = query().from( ['array'] );
        expect(q).to.equal( undefined );
      }
      catch( e ) { err = e; }

      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /resource.*string/ );
    });
  });


  describe('.include(fields)', function() {
    it('sets `include` when passed a string', function() {
      var q = query().include('id');
      expect( q.qo.include ).to.have.length(1);
      expect( q.qo.include[0] ).to.equal( 'id' );
    });

    it('throws if not passed a string', function() {
      var err;
      try {
        var q = query().include( ['hello']);
        expect(q).to.equal( undefined );
      }
      catch(e) {
        err = e;
      }
      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /include.*fields/ );
    });

    it('applies space separated string as multiple fields', function() {
      var q = query().include( '1 2 3' );
      expect( q.qo.include ).to.have.length( 3 );
      expect( q.qo.include ).to.contain( '1','2','3' );
    });
  });


  describe('.exclude( fields )', function() {

    it('sets `exclude` when passed a string', function() {
      var q = query().exclude( 'name' );
      expect( q.qo.exclude ).to.have.length( 1 );
      expect( q.qo.exclude ).to.contain( 'name' );
    });

    it('applies space separated string as multiple onto excludes', function() {
      var q = query().exclude( 'name !' );
      expect( q.qo.exclude ).to.have.length( 2 );
      expect( q.qo.exclude ).to.contain( 'name', '!' );
    });

    it('throws error if not provided Array or String', function() {
      var err;
      try {
        query().exclude( 123 );
      }
      catch( e ) { err = e; }
      expect( err ).to.be.an.instanceof( Error );
    });

  });


});
