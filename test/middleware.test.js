
/**
 * Test dependencies
 */

var query = require('../lib/index.js'),
    expect = require('expect.js');


describe('Middleware', function() {

  it('is only applied when an adapter is present', function( done ) {
    var ref = 0;
    var q = query().pre( 'save', function() { return ref++; } );

    expect( q.middleware.pre.save ).to.have.length( 1 );

    function cb2( err, res ) {
      expect( err ).to.be( null );
      expect( res ).to.be( 'moo' );

      // This time, the pre middleware should have fired
      expect( ref ).to.be( 1 );
      done();
    }

    function cb1( err, res ) {
      // Check arguments are as expected
      expect( err ).to.be(null);
      expect( res ).to.be.a( query.Query );

      // Then check that ref wasn't changed (no middleware executed)
      expect( ref ).to.be( 0 );

      // Setup an adapter
      q.useAdapter( {exec: function(q,cb) { cb(null,'moo'); }});
      q.save().done( cb2 );
    }

    q.from('woo').save().done( cb1 );
  });

  it('registers a pre hook', function() {
    var q = query()
      .from('woo')
      .pre( 'save', function() { return true;  } );

    expect( q.middleware.pre.save ).to.be.an( Array );
    expect( q.middleware.pre.save ).to.have.length( 1 );
  });

  it('registers a post hook', function() {
    var q = query().post( 'save', function() { return true;  } );

    expect( q.middleware.post.save ).to.be.an( Array );
    expect( q.middleware.post.save ).to.have.length( 1 );
  });

  it('executes pre middleware for a given action', function(done) {
    var ref = 0;
    var q = query().pre( 'save', function() { return ref++; } );

    var cb = function() {
      expect( ref ).to.be( 1 );
      done();
    };

    q.useAdapter( {exec: function(q,cb) { cb(null,'moo'); }});

    q.from('woo').save().done( cb );
  });

  it('pre methods are passed Query# instance (query)', function( done ) {
    var ref = 0;
    var q = query().pre( 'save', function( qi ) { ref = qi; } );

    var cb = function() {
      expect( ref ).to.be.a( query.Query );
      done();
    };

    q.useAdapter( {exec: function(q,cb) { cb(null,'moo'); }});

    q.from('woo').save().done( cb );
  });

  it('executes post middleware for a given action', function( done ) {
    var ref = 0;
    var q = query()
      .post( 'save', function() { ref=ref+3; })
      .post( 'save', function() { ref=ref+2; });

    var cb = function() {
      expect( ref ).to.be( 5 );
      done();
    };

    q.useAdapter( {exec: function(q,cb) { cb(null,'moo'); }});

    q.from('woo').save().done( cb );
  });

  it('post methods are passed (err, res)', function( done ) {
    var arity;
    var q = query()
      .post( 'save', function() {
        arity = arguments.length;
      });

    var cb = function() {
      expect( arity ).to.be( 2 );
      done();
    };

    q.useAdapter( {exec: function(q,cb) { cb(null,'moo'); }});

    q.from('woo').save().done( cb );
  });

  it('post middleware mutates `err,res` parameters', function( done ) {
    var q = query()
      .post( 'save', function(err, res) {
        err = new Error('Making bacon');
        res = [{newthing: true}]
        return [err, res];
      });

    function cb( err, res ) {
      expect( err ).to.be.an( Error );
      expect( err.message ).to.be( 'Making bacon' );
      expect( res ).to.have.length( 1 );
      expect( res[0].newthing ).to.be( true );
      done();
    }

    q.useAdapter( {exec: function(q,cb) { cb(null,'moo'); }});

    q.from('woo').save().done( cb );
  });

});
