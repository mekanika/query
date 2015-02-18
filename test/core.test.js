var query = require('../lib/index.js');
var expect = require('chai').expect;

// Currently `query` expects an adapter() to return an `.exec()` method
var adapterStub = { exec: function(){} };


describe('query Core', function() {

  it('exports the Query constructor as query.Query', function() {
    expect( query.Query ).to.be.an.instanceof( Function );
  });

  it('exposes query.mc(op, mos) MatchContainer method', function () {
    expect( query.mc ).to.be.an.instanceof( Function );
    expect( query.mc('or') ).to.include.key('or');
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

  it('.raw(qe) allows setting Qe manually', function () {
    var q = query().raw({do:'nothing'});
    expect( q.qe.do ).to.equal('nothing');
  });


  describe('.on(resource)', function() {

    it('sets the resource when provided', function() {
      var q = query().on('icecream');
      expect( q.qe.on ).to.equal( 'icecream' );
    });

    it('fail to set resource if not provided string', function() {
      var err;
      try {
        var q = query().on( ['array'] );
        expect(q).to.equal( undefined );
      }
      catch( e ) { err = e; }

      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /resource.*string/ );
    });
  });


  describe('.body(data)', function () {
    it('sets body contents', function () {
      var q = query().body([{a:1}]);
      expect( q.qe.body ).to.eql([{a:1}]);
    });

    it('forces data to an array', function () {
      var q = query().body({a:1});
      expect( q.qe.body ).to.eql([{a:1}]);
    });

    it('no-ops on undefined data', function () {
      expect( query().body().qe ).to.not.include.key('body');
    });

    it('no-ops on empty array data', function () {
      expect( query().body([]).qe ).to.not.include.key('body');
    });
  });


  describe('.ids(data)', function () {
    it('sets id contents as array', function () {
      var q = query().ids('1234');
      expect( q.qe.ids ).to.eql(['1234']);
    });

    it('appends data as array to .ids', function () {
      var q = query().ids('1234').ids(['abc','def']);
      expect( q.qe.ids ).to.eql( ['1234','abc','def'] );
    });

    it('no-ops on undefined data', function () {
      expect( query().ids().qe ).to.not.include.key('ids');
    });

    it('no-ops on empty array data', function () {
      expect( query().ids([]).qe ).to.not.include.key('ids');
    });
  });


  describe('.select(fields)', function() {
    it('sets `select` when passed a string', function() {
      var q = query().select('id');
      expect( q.qe.select ).to.have.length(1);
      expect( q.qe.select[0] ).to.equal( 'id' );
    });

    it('throws if not passed a string or string array', function() {
      var err;
      query().select( ['hello'] );
      query().select( 'hello' );
      try {
        var q = query().select( true );
      }
      catch(e) {
        err = e;
      }
      expect( err ).to.be.an.instanceof( Error );
    });

    it('applies space separated string as multiple fields', function() {
      var q = query().select( '1 2 3' );
      expect( q.qe.select ).to.have.length( 3 );
      expect( q.qe.select ).to.contain( '1','2','3' );
    });
  });

  describe('.meta(obj)', function () {

    it('sets up a new meta field on first instantiation', function () {
      var q = query().meta({a:1});
      expect( q.qe.meta ).to.be.an.instanceof( Object );
      expect( q.qe.meta.a ).to.equal(1);
    });

    it('adds subsequent hashes to the meta field', function () {
      var q = query().meta({a:1}).meta({b:2,c:3});
      expect( q.qe.meta ).to.have.keys( 'a', 'b', 'c' );
    });

  });


});
