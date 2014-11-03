var query = require('../lib/index.js');
var expect = require('chai').expect;


describe('Updates', function() {

  describe('.set( field [, to ] )', function() {

    it('sets the action to `update`', function() {
      var q = query().set('skill');
      expect( q.qo.action ).to.equal( 'update' );
    });

    it('applies a `set` modifier and return a query', function() {
      var q = query().set('skill');
      expect( q ).to.be.an.instanceof( query.Query );
      expect( q.qo.updates[0] ).to.include.key( 'set' );
      expect( q.qo.updates[0].set ).to.equal( 'skill' );
    });

    it('fails to set a modifier if `field` if not a string', function() {
      var err;
      try { var q = query().set( 1 ); }
      catch( e ) { err = e; }

      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /query#set.*string/ );
    });

    it('sets the value using .to( value )', function() {
      var q = query().set( 'skill' ).to( 10 );
      expect( q.qo.updates[0].value ).to.equal( 10 );
    });

    it('sets the value if passed directly', function() {
      var q = query().set( 'skill', 10 );
      expect( q.qo.updates[0].value ).to.equal( 10 );
    });

  });


  describe('.unset( field )', function() {

    it('sets the action to `update`', function() {
      var q = query().unset('skill');
      expect( q.qo.action ).to.equal( 'update' );
    });

    it('sets modifier to `unset`', function() {
      var q = query().unset( 'skill' );
      expect( q.qo.updates[0] ).to.include.key( 'unset' );
    });

    it('applies an `unset` modifier and return a query', function() {
      var q = query().unset('skill');
      expect( q ).to.be.an.instanceof( query.Query );
      expect( q.qo.updates[0] ).to.include.key( 'unset' );
      expect( q.qo.updates[0].unset ).to.equal( 'skill' );
    });

    it('fails to apply if `field` not a string', function() {
      var err;
      try { var q = query().unset( 1 ); }
      catch( e ) { err = e; }

      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /query#unset.*string/ );
    });
  });


  describe('.increment( field [, amount ] )', function() {

    it('sets the action to `update`', function() {
      var q = query().increment('skill');
      expect( q.qo.action ).to.equal( 'update' );
    });

    it('sets modifier to `inc`', function() {
      var q = query().increment( 'skill' );
      expect( q.qo.updates[0] ).to.include.key( 'inc' );
      expect( q.qo.updates[0].inc ).to.equal( 'skill' );
    });

    it('fails if `field` not a string', function() {
      var err;
      try { var q = query().increment( 1 ); }
      catch( e ) { err = e; }

      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /field.*string/ );
    });

    it('sets `amount` if passed', function() {
      var q = query().increment( 'skill', 5 );
      expect( q.qo.updates[0] ).to.include.key( 'inc' );
      expect( q.qo.updates[0].inc ).to.equal( 'skill' );
      expect( q.qo.updates[0].value ).to.equal( 5 );
    });

    it('fails if `amount` not a number', function() {
      var err;
      try { var q = query().increment( 'skill', 'fail' ); }
      catch( e ) { err = e; }

      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /type.*number/ );
    });

    it('sets amount with .by( amount )', function() {
      var q = query().increment( 'skill' ).by( 5 );
      expect( q.qo.updates[0].value ).to.equal( 5 );
    });

    it('aliases as .increase()', function() {
      var q = query().increase( 'skill', 5 );
      expect( q.qo.updates[0] ).to.include.key( 'inc' );
      expect( q.qo.updates[0].inc ).to.equal( 'skill' );
      expect( q.qo.updates[0].value ).to.equal( 5 );
    });

    describe('.decrement( field, amount )', function() {

      it('shorthand `inc, -val` .decrement( field, amount )', function() {
        var q = query().decrement( 'skill', 5 );
        expect( q.qo.updates[0] ).to.include.key( 'inc' );
        expect( q.qo.updates[0].value ).to.equal( -5 );
      });

      it('aliases .decrement as `.decrease(...)`', function() {
        var q = query().decrease( 'skill', 5 );
        expect( q.qo.updates[0] ).to.include.key( 'inc' );
        expect( q.qo.updates[0].value ).to.equal( -5 );
      });

      it('fails if amount is not set', function() {
        var err;
        try {
          var q = query().decrement( 'skill' );
        }
        catch( e ) { err = e; }

        expect( err ).to.be.an.instanceof( Error );
        expect( err.message ).to.match( /Decrement.*value/ );
      });

      it('fails if amount is not a number', function() {
        var err;
        try {
          var q = query().decrement( 'skill', 'fail' );

        }
        catch( e ) { err = e; }

        expect( err ).to.be.an.instanceof( Error );
        expect( err.message ).to.match( /value.*number/ );
      });
    });



  });


});
