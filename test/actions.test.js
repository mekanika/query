var query = require('../lib/index.js');
var expect = require('chai').expect;

describe('Action methods', function() {

  // ## .create( payload, cb )
  describe('.create( payload [, cb] )', function() {

    it('fails if callback not a function', function() {
      var err;
      try {
        query().on('boop').create('payload', 'fakefunction');
      }
      catch( e ) {
        err = e;
      }
      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /requires.*Function/ );
    });

    it('callback passed `query` object on success', function(done) {
      var cb = function( err, res ) {
        expect( res ).to.not.be.empty;
        expect( res.do ).to.equal( 'create' );
        expect( res.body[0] ).to.equal( 'record' );
        done();
      };
      query().on('something').create('record', cb);
    });

    it('stores multiple payloads on create', function(done) {
      var cb = function( err, res ) {
        expect( res.body.length ).to.equal( 3 );
        expect( res.body ).to.eql(['a','b',3]);
        done();
      };
      query().on('something').create(['a','b',3], cb);
    });

    it('returns Query# if no callback', function() {
      var q = query().on('anything').create('hello');
      expect( q ).to.not.be.empty;
      expect( q ).to.be.an.instanceof( query.Query );
    });
  });


  // ## .update()
  describe('.update( [ids], [update], [cb] )', function() {

    it('sets action and no-op if nothing passed', function() {
      var q = query().on('me').update();
      expect( q.qe.do ).to.equal( 'update' );
    });

    it('accepts single argument as input object', function( done ) {
      function cb( err, res ) {
        // Ensure update data is set
        expect( res.body ).to.have.length( 1 );
        expect( res.body[0] ).to.have.keys( 'name' );
        expect( res.body[0].name ).to.equal( 'Jack' );

        done();
      }

      var q = query().on('me').update( {name:'Jack'} );
      expect( q ).to.be.an.instanceof( query.Query );

      q.done( cb );
    });

    it('sets single string ids param', function () {
      var q = query().on('me').update( '12345', {name:'Jack'} );

      expect( q.qe.ids ).to.have.length( 1 );
      expect( q.qe.ids[0] ).to.equal( '12345' );

      // Ensure update data is set
      expect( q.qe.body ).to.have.length( 1 );
      expect( q.qe.body[0] ).to.have.keys( 'name' );
      expect( q.qe.body[0].name ).to.equal( 'Jack' );
    });

    it('sets conditions for array of string ids', function () {
      var q = query().on('me').update( ['1234','5671'], {name:'Jack'} );

      expect( q.qe.ids ).to.have.length( 2 );
      expect( q.qe.ids[1] ).to.equal('5671');

      // Ensure update data is set
      expect( q.qe.body ).to.have.length( 1 );
      expect( q.qe.body[0] ).to.have.keys( 'name' );
      expect( q.qe.body[0].name ).to.equal( 'Jack' );
    });

    it('runs a callback if one passed', function( done ) {
      function cb( err, res ) {
        expect( res ).to.not.be.empty;
        done();
      }
      query().on('me').update( '1234', {name:'Joe'}, cb );
    });

    it('fails if callback is passed but not a function', function() {
      var err;
      try {
        var q = query().on('me').update( 1, 2, 'notafunction' );
        expect( q ).to.equal( undefined );
      }
      catch( e ) { err = e; }
      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /update.*function/ );
    });

  });


  // ## .find()
  describe('.find( [ids] [, cb] )', function() {

    it('returns a `find` action query() if no params', function(){
      var q = query().find();
      expect( q ).to.not.be.empty;
      expect( q.qe.do ).to.equal( 'find' );
    });

    it('sets find ids if passed', function() {
      // Test literal is pushed onto .fields array
      var q = query().find('moop');
      expect( q.qe.ids ).to.have.length( 1 );
      // Check item array
      q = query().find(['moop','smee']);
      expect( q.qe.ids ).to.have.length( 2 );
    });

    it('runs a callback if one is passed', function() {
      var cb = function(err, res) {
        // Check that no error was thrown
        expect( res ).to.not.be.empty;
        expect( res.ids ).to.contain( 'moop' );
        // Ensure the 'callback' wasn't added as a field
        expect( res.ids ).to.have.length( 1 );
      };
      query().on('anything').find('moop', cb);
    });

    it('fails if callback is passed but not a function', function() {
      var err;
      try {
        var q = query().on('me').find( 'moo', 'moo2' );
        expect( q ).to.equal( undefined );
      }
      catch( e ) { err = e; }
      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /find.*function/ );
    });
  });


  describe('.remove([id , cb])', function() {

    it('only sets `remove` action on .remove( undefined )', function() {
      var q = query().remove();
      expect( q.qe ).to.have.key( 'do' );
      expect( q.qe.do ).to.equal( 'remove' );
    });

    it('adds an `id` as a new constraint', function() {
      var q = query().remove( '12345' );
      expect( q.qe.ids ).to.have.length( 1 );
      expect( q.qe.ids[0] ).to.equal( '12345' );
    });

    it('sets the remove action to be \'remove\'', function() {
      var q = query().remove('abc');
      expect( q.qe.do ).to.equal('remove');
    });

    it('adds multiple ids as multiple matches', function() {
      var q = query().remove( [1,2,3,4] );
      expect( q.qe.ids ).to.have.length( 4 );
    });

    it('fails if callback is passed but not a function', function() {
      var err;
      try {
        var q = query().on('me').remove( 1, 'notafunction' );
        expect( q ).to.equal( undefined );
      }
      catch( e ) { err = e; }
      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /remove.*function/ );
    });
  });


  describe('.done([cb])', function() {

    it('callback is optional', function(done) {
      query().done();
      done();
    });

    it('passes only the query object to callback if no adapter', function() {
      var cb = function( err, res ) {
        expect( res ).to.not.be.empty;
        expect( res.do ).to.equal('create');
      };

      query().on('anything').create('obj').done( cb );
    });

    it('runs .exec( query, cb ) adapter if one provided', function() {
      var gotCallback = false;

      // Stub adapter
      var testadapter = {
          exec:function(query,cb) {
            gotCallback = true;
            expect( query ).to.not.be.empty;
            expect( query.on ).to.equal( 'anything' );
            expect( cb ).to.be.ok;
          }
        };

      var cb = function(err, res) {};


      // Init the query
      var q = query( testadapter ).on('anything').find('me');
      // Ensure the adapter is set
      expect( q.adapter ).to.be.ok;
      // Run the query through the adapter
      q.done(cb);

      expect( gotCallback ).to.equal( true );
    });

    it('appends calling Qo to callback params', function() {
      // Create a faux adapter that returns `cb( err, res )`
      var a = {exec: function(q,cb) { cb('err', 'res'); } };
      var q = query().useAdapter( a );

      // Expect to get not just err + res back, but also q (a Query)
      function cb( err, res, q ) {
        expect( q.on ).to.equal( '!' );
      }

      q.on('!').find().done( cb );
    });

  });

});
