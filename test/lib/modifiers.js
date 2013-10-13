var query = require('../../lib/index.js');
var expect = require('expect.js');


describe('Modifiers', function() {

  it('should support modifiers array as property on query#', function() {
    var q = query();
    expect( q.modifiers ).to.not.be( undefined );
    expect( q.modifiers ).to.be.an( Array );
  });

  describe('.set( field [, to ] )', function() {

    it('should set the action to `update`', function() {
      var q = query().set('skill');
      expect( q.action ).to.be( 'update' );
    });

    it('should apply a `set` modifier and return a query', function() {
      var q = query().set('skill');
      expect( q ).to.have.keys( 'constraints', 'modifiers' );
      expect( q.modifiers[0] ).to.have.key( 'set' );
      expect( q.modifiers[0].set ).to.be( 'skill' );
    });

    it('should fail to set a modifier if `field` if not a string', function() {
      var err;
      try { var q = query().set( 1 ); }
      catch( e ) { err = e; }

      expect( err ).to.be.an( Error );
      expect( err.message ).to.match( /query#set.*string/ );
    });

    it('should set the value using .to( value )', function() {
      var q = query().set( 'skill' ).to( 10 );
      expect( q.modifiers[0].value ).to.be( 10 );
    });

    it('should set the value if passed directly', function() {
      var q = query().set( 'skill', 10 );
      expect( q.modifiers[0].value ).to.be( 10 );
    });

  });


  describe('.unset( field )', function() {

    it('should set the action to `update`', function() {
      var q = query().unset('skill');
      expect( q.action ).to.be( 'update' );
    });

    it('should set modifier to `unset`', function() {
      var q = query().unset( 'skill' );
      expect( q.modifiers[0] ).to.have.keys( 'unset' );
    });

    it('should apply an `unset` modifier and return a query', function() {
      var q = query().unset('skill');
      expect( q ).to.have.keys( 'constraints', 'modifiers' );
      expect( q.modifiers[0] ).to.have.key( 'unset' );
      expect( q.modifiers[0].unset ).to.be( 'skill' );
    });

    it('should fail to apply if `field` not a string', function() {
      var err;
      try { var q = query().unset( 1 ); }
      catch( e ) { err = e; }

      expect( err ).to.be.an( Error );
      expect( err.message ).to.match( /query#unset.*string/ );
    });
  });


  describe('.rename( field, to )', function() {

    it('should set the action to `update`', function() {
      var q = query().rename('skill', 'skillz');
      expect( q.action ).to.be( 'update' );
    });

    it('should set modifier to `rename`', function() {
      var q = query().rename( 'skill', 'sklz' );
      expect( q.modifiers[0] ).to.have.keys( 'rename' );
    });

    it('should apply a rename modifier', function() {
      var q = query().rename( 'skill', 'skillz' );

      expect( q.modifiers[0].rename ).to.be( 'skill' );
      expect( q.modifiers[0].value ).to.be( 'skillz' );
    });

    it('should fail .rename(...) if `field` not a string', function() {
      var err;
      try { var q = query().rename( 1 ); }
      catch( e ) { err = e; }

      expect( err ).to.be.an( Error );
      expect( err.message ).to.match( /query#rename.*string/ );
    });

    it('should fail .rename(...) if `to` not a string', function() {
      var err;
      try { var q = query().rename( 'skill', 1 ); }
      catch( e ) { err = e; }

      expect( err ).to.be.an( Error );
      expect( err.message ).to.match( /Renamed field.*string/ );
    });
  });


  describe('.increment( field [, amount ] )', function() {

    it('should set the action to `update`', function() {
      var q = query().increment('skill');
      expect( q.action ).to.be( 'update' );
    });

    it('should set modifier to `inc`', function() {
      var q = query().increment( 'skill' );
      expect( q.modifiers[0] ).to.have.keys( 'inc' );
      expect( q.modifiers[0].inc ).to.be( 'skill' );
    });

    it('should fail if `field` not a string', function() {
      var err;
      try { var q = query().increment( 1 ); }
      catch( e ) { err = e; }

      expect( err ).to.be.an( Error );
      expect( err.message ).to.match( /field.*string/ );
    });

    it('should set `amount` if passed', function() {
      var q = query().increment( 'skill', 5 );
      expect( q.modifiers[0] ).to.have.keys( 'inc' );
      expect( q.modifiers[0].inc ).to.be( 'skill' );
      expect( q.modifiers[0].value ).to.be( 5 );
    });

    it('should fail if `amount` not a number', function() {
      var err;
      try { var q = query().increment( 'skill', 'fail' ); }
      catch( e ) { err = e; }

      expect( err ).to.be.an( Error );
      expect( err.message ).to.match( /value.*number/ );
    });

    it('should set amount with .by( amount )', function() {
      var q = query().increment( 'skill' ).by( 5 );
      expect( q.modifiers[0].value ).to.be( 5 );
    });

    it('should alias as .increase()', function() {
      var q = query().increase( 'skill', 5 );
      expect( q.modifiers[0] ).to.have.keys( 'inc' );
      expect( q.modifiers[0].inc ).to.be( 'skill' );
      expect( q.modifiers[0].value ).to.be( 5 );
    });

    describe('.decrement( field, amount )', function() {

      it('should shorthand .decrement( field, amount )', function() {
        var q = query().decrement( 'skill', 5 );
        expect( q.modifiers[0] ).to.have.keys( 'inc' );
        expect( q.modifiers[0].value ).to.be( -5 );
      });

      it('should alias .decrement as `.decrease(...)`', function() {
        var q = query().decrease( 'skill', 5 );
        expect( q.modifiers[0] ).to.have.keys( 'inc' );
        expect( q.modifiers[0].value ).to.be( -5 );
      });

      it('should fail if amount is not set', function() {
        var err;
        try {
          var q = query().decrement( 'skill' );
        }
        catch( e ) { err = e; }

        expect( err ).to.be.an( Error );
        expect( err.message ).to.match( /Decrement.*value/ );
      });

      it('should fail if amount is not a number', function() {
        var err;
        try {
          var q = query().decrement( 'skill', 'fail' );

        }
        catch( e ) { err = e; }

        expect( err ).to.be.an( Error );
        expect( err.message ).to.match( /value.*number/ );
      });
    });



  });


});
