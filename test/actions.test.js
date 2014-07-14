var query = require('../lib/index.js');
var expect = require('chai').expect;

describe('Action methods', function() {

  beforeEach( function(){
    query.reset();
  });

  // ## .create( payload, cb )
  describe('.create( payload [, cb] )', function() {

    it('fails if no .from(model) is set', function() {
      var cb = function( err, res ) {
        expect( err ).to.exist;;
        // Loosely check that the error message indicts "select"
        expect( err ).to.match( /from.*?action/ig );
      };
      query().create('record', cb);
    });

    it('fails if callback not a function', function() {
      var err;
      try {
        query().from('boop').create('payload', 'fakefunction');
      }
      catch( e ) {
        err = e;
      }
      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /requires.*Function/ );
    });

    it('callback passed `query` object on success', function() {
      var cb = function( err, res ) {
        expect( res ).to.not.be.empty;
        expect( res.action ).to.equal( 'create' );
        expect( res.content[0] ).to.equal( 'record' );
      };
      query().from('something').create('record', cb);
    });

    it('stores multiple payloads on create', function() {
      var cb = function( err, res ) {
        expect( res.content.length ).to.equal( 3 );
        expect( res.content ).to.eql(['a','b',3]);
      };
      query().from('something').create(['a','b',3], cb);
    });

    it('returns query object if no callback', function() {
      var q = query().from('anything').create('hello');
      expect( q ).to.not.be.empty;
      expect( q.content[0] ).to.equal( 'hello' );
    });
  });


  // ## .save()
  describe('.save( records, cb )', function() {

    it('sets action to `save`', function() {
      var q = query().from('what').save( {a:1} );
      expect( q.action ).to.equal( 'save' );
    });

    it('handles single and object array payload', function() {
      // Test passing single objects
      var q = query().from('what').save( {a:1} );
      expect( q.content ).to.have.length( 1 );
      q.save( {a:5} );
      expect( q.content ).to.have.length( 2 );

      // Test passing object arrays
      q = query().from('what').save( [{a:1}, {a:5}] );
      expect( q.content ).to.have.length( 2 );
    });

    it('fails if `cb` is not a function', function() {
      var err;
      try {
        var q = query().from('what').save( {}, 'notafunction' );
        expect( q ).to.equal( undefined );
      }
      catch( e ) { err = e; }
      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /save.*requires/ );
    });

    it('runs callback if passed', function( done ) {
      var cb = function( err, res ) {
        expect( res.action ).to.equal( 'save' );
        expect( res.content[0].a ).to.equal( 1 );
        done();
      };
      query().from('what').save( {a:1}, cb );
    });

  });


  // ## .update()
  describe('.update( [conditions], [update], [cb] )', function() {

    it('sets action and no-op if nothing passed', function() {
      var q = query().from('me').update();
      expect( q.action ).to.equal( 'update' );
    });

    it('accepts single argument as input object', function( done ) {
      function cb( err, res ) {
        // Ensure update data is set
        expect( res.content ).to.have.length( 1 );
        expect( res.content[0] ).to.have.keys( 'name' );
        expect( res.content[0].name ).to.equal( 'Jack' );

        done();
      }

      var q = query().from('me').update( {name:'Jack'} );
      expect( q ).to.be.an.instanceof( query.Query );

      q.done( cb );
    });

    it('sets conditions as a single string id', function( done ) {
      function cb( err, res ) {
        expect( res.constraints ).to.have.length( 1 );
        expect( res.constraints[0].operator ).to.equal( 'eq' );
        expect( res.constraints[0].condition ).to.equal( '12345' );

        // Ensure update data is set
        expect( res.content ).to.have.length( 1 );
        expect( res.content[0] ).to.have.keys( 'name' );
        expect( res.content[0].name ).to.equal( 'Jack' );

        done();
      }
      query().from('me').update( '12345', {name:'Jack'} ).done( cb );
    });

    it('sets conditions for array of string ids', function( done ) {
      function cb( err, res ) {
        expect( res.constraints ).to.have.length( 1 );
        expect( res.constraints[0].operator ).to.equal( 'in' );
        expect( res.constraints[0].condition ).to.have.length( 2 );

        // Ensure update data is set
        expect( res.content ).to.have.length( 1 );
        expect( res.content[0] ).to.have.keys( 'name' );
        expect( res.content[0].name ).to.equal( 'Jack' );

        done();
      }
      query().from('me').update( ['1234','5671'], {name:'Jack'} ).done( cb );
    });

    it('runs a callback if one passed', function( done ) {
      function cb( err, res ) {
        expect( res ).to.not.be.empty;
        done();
      }
      query().from('me').update( '1234', {name:'Joe'}, cb );
    });

    it('fails if callback is passed but not a function', function() {
      var err;
      try {
        var q = query().from('me').update( 1, 2, 'notafunction' );
        expect( q ).to.equal( undefined );
      }
      catch( e ) { err = e; }
      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /update.*function/ );
    });

  });


  // ## .find()
  describe('.find( [identifiers] [, cb] )', function() {

    it('returns a `find` action query() if no params', function(){
      var q = query().find();
      expect( q ).to.not.be.empty;
      expect( q.identifiers ).to.have.length( 0 );
      expect( q.action ).to.equal( 'find' );
    });

    it('sets find identifiers if passed', function() {
      // Test literal is pushed onto .fields array
      var q = query().find('moop');
      expect( q.identifiers ).to.have.length( 1 );
      // Check item array
      q = query().find(['moop','smee']);
      expect( q.identifiers ).to.have.length( 2 );
    });

    it('runs a callback if one is passed', function() {
      var cb = function(err, res) {
        // Check that no error was thrown
        expect( res ).to.not.be.empty;
        expect( res.identifiers ).to.contain( 'moop' );
        // Ensure the 'callback' wasn't added as a field
        expect( res.identifiers ).to.have.length( 1 );
      };
      query().from('anything').find('moop', cb);
    });

    it('fails a callback find if no .from(model) set', function() {
      var cb = function(err, res) {
        expect( err ).to.match( /from/ );
      };
      query().find('moop', cb);
    });

    it('fails if callback is passed but not a function', function() {
      var err;
      try {
        var q = query().from('me').find( 'moo', 'moo2' );
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
      expect( q.constraints ).to.have.length( 0 );
      expect( q.action ).to.equal( 'remove' );
    });

    it('adds an `id` as a new constraint', function() {
      var q = query().remove( '12345' );
      expect( q.identifiers ).to.have.length( 1 );
      expect( q.identifiers[0] ).to.equal( '12345' );
    });

    it('sets the remove action to be \'remove\'', function() {
      var q = query().remove('abc');
      expect( q.action ).to.equal('remove');
    });

    it('adds multiple ids as multiple constraints', function() {
      var q = query().remove( [1,2,3,4] );
      expect( q.identifiers ).to.have.length( 4 );
    });

    it('fails if callback is passed but not a function', function() {
      var err;
      try {
        var q = query().from('me').remove( 1, 'notafunction' );
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

    it('returns an error if no .from(model) set', function() {
      try {
        query().done( function(err){
          expect( err ).to.exist;
          expect( err ).to.match( /from/ );
        });
      }
      catch( e ) {
        // Should never get here. Make sure of that.
        expect( e ).to.equal( undefined );
      }
    });

    it('returns an error if no `action` set', function() {
      try {
        query().from('anything').done( function(err){
          expect( err ).to.exist;
          expect( err ).to.match( /action/ );
        });
      }
      catch( e ) {
        // Should never get here. Make sure of that.
        expect( e ).to.equal( undefined );
      }
    });

    it('passes only the query object to callback if no adapter', function() {
      var cb = function( err, res ) {
        expect( res ).to.not.be.empty;
        expect( res.action ).to.equal('create');
      };

      query().from('anything').create('obj').done( cb );
    });

    it('runs .exec( query, cb ) adapter if one provided', function() {
      var gotCallback = false;

      // Stub adapter
      var adapter = function(){
        return {
          exec:function(query,cb) {
            gotCallback = true;
            expect( query ).to.not.be.empty;
            expect( query.resource ).to.equal( 'anything' );
            expect( cb ).to.be.ok;
          }
        };
      };

      var cb = function(err, res) {};

      // Set the adapter class to our stub
      query.adapterClass( adapter );
      // Init the query
      var q = query('testadapter').from('anything').find('me');
      // Ensure the adapter is set
      expect( q.adapter ).to.be.ok;
      // Run the query through the adapter
      q.done(cb);

      expect( gotCallback ).to.equal( true );
    });

    it('appends `this` query to callback params', function() {
      // Create a faux adapter that returns `cb( err, res )`
      var a = {exec: function(q,cb) { cb('err', 'res'); } };
      var q = query().useAdapter( a );

      // Expect to get not just err + res back, but also q (a Query)
      function cb( err, res, q ) {
        expect( q ).to.be.an.instanceof( query.Query );
        expect( q.resource ).to.equal( '!' );
      }

      q.from('!').find().done( cb );
    });

  });

});
