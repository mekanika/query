
/**
 * Test dependencies
 */

var query = require('../lib/index.js'),
    posthook = require('../lib/proto/actions').posthook,
    expect = require('chai').expect;


describe('Middleware', function() {

  var fauxAdapter = {exec: function(q,cb) { cb(null,'moo'); }};

  describe('core initialisation', function() {

    it('is only applied when an adapter is present', function( done ) {
      var ref = 0;
      var q = query().pre( 'find', function(q,n) { ref++; n(); } );

      expect( q.middleware.pre.find ).to.have.length( 1 );

      function cb2( err, res ) {
        expect( err ).to.not.be.ok;
        expect( res ).to.equal( 'moo' );

        // This time, the pre middleware should have fired
        expect( ref ).to.equal( 1 );
        done();
      }

      function cb1( err, res ) {
        // Check arguments are as expected
        expect( err ).to.exist;
        expect( err ).to.match( /no adapter/ig );
        expect( res ).to.include.keys('do');

        // Then check that ref wasn't changed (no middleware executed)
        expect( ref ).to.equal( 0 );

        // Setup an adapter
        q.useAdapter( {exec: function(q,cb) { cb(null,'moo'); }});
        q.find().done( cb2 );
      }

      q.on('woo').find().done( cb1 );
    });

    it('registers a pre hook', function() {
      var q = query()
        .on('woo')
        .pre( 'find', function() { return true;  } );

      expect( q.middleware.pre.find ).to.be.an.instanceof( Array );
      expect( q.middleware.pre.find ).to.have.length( 1 );
    });

    it('registers a post hook', function() {
      var q = query().post( 'find', function() { return true;  } );

      expect( q.middleware.post.find ).to.be.an.instanceof( Array );
      expect( q.middleware.post.find ).to.have.length( 1 );
    });

    it('registers hooks with no action as `all`', function () {
      var q = query()
        .pre( function() {return 1;} )
        .post( function() {return 2;} );

      expect( q.middleware.post.all ).to.be.an.instanceof( Array );
      expect( q.middleware.post.all ).to.have.length( 1 );
      expect( q.middleware.pre.all ).to.be.an.instanceof( Array );
      expect( q.middleware.pre.all ).to.have.length( 1 );
    });

    it('can pass hooks as an Array of fns', function () {
      var q = query()
        .pre([
          function () { return 1; },
          function () { return 2; }
        ]);
      expect( q.middleware.pre.all ).to.have.length( 2 );
    });

  });



  describe('pre', function() {

    it('executes pre middleware for a given action', function(done) {
      var ref = 0;
      var q = query().pre( 'find', function(q,n) { ref++; n(); } );

      var cb = function() {
        expect( ref ).to.equal( 1 );
        done();
      };

      q.useAdapter( fauxAdapter );
      q.on('woo').find().done( cb );
    });

    it('executes pre hooks for `all`', function (done) {
      var ref = 0;
      var q = query().pre( function (q,n) { ref++; n(); } );

      var cb = function () {
        expect( ref ).to.equal( 1 );
        done();
      };
      q.useAdapter( fauxAdapter );
      q.on('woo').find().done( cb );
    });

    it('pre methods are passed the Qe', function( done ) {
      var ref = 0;
      var q = query().pre( 'find', function (qi,n) { ref = qi; n(); } );

      var cb = function() {
        expect( ref ).to.include.keys('do','on');
        done();
      };

      q.useAdapter( fauxAdapter );

      q.on('woo').find().done( cb );
    });

    it('can modify this query in pre', function( done ) {
      var q = query().pre( 'find', function( qry, next ) {
        qry.do = '^_^';
        next();
      });

      var cb = function(e,r,qry) {
        expect( qry.do ).to.equal( '^_^' );
        done();
      };

      q.useAdapter( fauxAdapter );

      q.on('woo').find().done( cb );
    });

  });



  describe('post', function() {

    it('executes post middleware for a given action', function( done ) {
      var ref = 0;
      var q = query()
        .post( 'find', function(e,r,q,n) { ref=ref+3; n(e,r); })
        .post( 'find', function(e,r,q,n) { ref=ref+2; n(e,r); });

      var cb = function() {
        expect( ref ).to.equal( 5 );
        done();
      };

      q.useAdapter( fauxAdapter );
      q.on('woo').find().done( cb );
    });

    it('executes post hooks for `all`', function (done) {
      var ref = 0;
      var q = query()
        .post( function(e,r,q,n) { ref=ref+3; n(e,r); })
        .post( function(e,r,q,n) { ref=ref+2; n(e,r); });

      var cb = function() {
        expect( ref ).to.equal( 5 );
        done();
      };

      q.useAdapter( fauxAdapter );
      q.on('woo').find().done( cb );
    });

    it('throws user returned Errors', function (done) {
      var post = [ function(e,r,q,n) {
        n(new Error('sucka'));
      } ];

      try {
        posthook( post, function() {}, query() )();
      }
      catch (e) {
        expect(e.message).to.equal('sucka');
        done();
      }
    });

    it('throws on hook failing to return (err,res) or Error', function (done) {
      var post = [ function(e,r,q,n) { n(); } ];

      try {
        posthook( post, function() {}, query() )();
      }
      catch (e) {
        expect(e.message).to.match( /failed/ig );
        done();
      }
    });

    it('blocks callback execution if post hooks threw', function (done) {
      var post = [ function(e,r,q,n) {
        n();
      } ];

      var callbackRan = false;
      try {
        posthook( post, function() { callbackRan = true; }, query() )();
      }
      catch (e) {
        expect(callbackRan).to.be.false;
        done();
      }
    });

    it('post methods are passed (err, res, qe, next)', function( done ) {
      var arity;
      var q = query()
        .post( 'find', function(e,r,q,n) {
          arity = arguments.length;
          expect(e).to.equal(null);
          expect(r).to.equal('moo');
          expect(q).to.have.keys('on', 'do');
          n(e,r);
        });

      var cb = function() {
        expect( arity ).to.equal( 4 );
        expect( arguments[2] ).to.include.keys( 'do', 'on' );
        done();
      };

      q.useAdapter( fauxAdapter );

      q.on('woo').find().done( cb );
    });

    it('post middleware mutates `err,res` parameters', function( done ) {
      var q = query()
        .post( 'find', function(err, res, q, next) {
          err = 'Making bacon';
          res = [{newthing: true}];
          next(err, res);
        });

      function cb( err, res ) {
        expect( err ).to.equal( 'Making bacon' );
        expect( res ).to.have.length( 1 );
        expect( res[0].newthing ).to.equal( true );
        done();
      }

      q.useAdapter( fauxAdapter );

      q.on('woo').find().done( cb );
    });

    it('post runs final callback with (err, res, qe)', function( done ) {
      var q = query()
        .post( 'find', function(e,r,q,n) {
          n(null,1);
        });

      function cb() {
        expect( arguments.length ).to.equal( 3 );
        expect( arguments[2] ).to.include.keys( 'do', 'on' );
        done();
      }

      q.useAdapter( fauxAdapter );
      q.on('^_^').find().done( cb );
    });

    it('can nest post hooks (async)', function (done) {
      var flag = false;

      var async = function (err, res, n) {
        setTimeout( function () {
          flag = 'green';
          n(err, res);
        },0);
      };
      var q = query().post( function (e,r,q,n) {
        async(e,r,n);
        // In SYNCHRONOUS mode, this would force flag to red.
        flag = 'red';
      });

      q.useAdapter(fauxAdapter);
      q.on('woo').find().done( function (e,r) {
        expect(flag).to.equal('green');
        done();
      });
    });

  });


});
