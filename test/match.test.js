var query = require('../lib/index.js');
var expect = require('chai').expect;


describe('Match .where( field [,val] )', function() {

  it('pushes .where( field ) onto constraints array', function() {
    var q = query().where('whatever');
    expect( q.qe.match ).to.have.length( 1 );
  });

  it('sets value when passed all .where(field,val)', function() {
    var q = query().where('id', 10);
    expect( q.qe.match[0].value ).to.equal( 10 );
  });

  it('has constraint structure {field,op,value}', function(){
    var q = query().where('id');
    expect( q.qe.match[0] )
      .to.have.keys( 'field', 'op','value' );
  });

  it('pushes default operator and value for .where(field)', function(){
    var q = query().where('id');
    expect( q.qe.match[0].op ).to.equal( 'eq' );
    expect( q.qe.match[0].value ).to.equal( true );
  });

  it('supports creating multiple .where() conditions', function() {
    var q = query().where('id').eq(100).where('name').eq('beep');
    expect( q.qe.match ).to.have.length( 2 );
  });

  it('prevents setting constraints if ids were set', function() {
    var err, q;
    try {
      q = query().find(['1234', 4123]).where('smoo').is( true );
    }
    catch( e ) { err = e; }
    expect( err ).to.be.an.instanceof( Error );
    expect( err.message ).to.match( /find.*id/ );
  });

  describe('.{op}( condition )', function() {

    // Copied directly from source
    var operators = [
      'eq',  // ===
      'is',  // Alias 'eq' (more fluent for non-numeric)
      'neq', // !==
      'not', // Alias 'neq'
      'in',  // has
      'nin', // !has
      'lt',  // <
      'gt',  // >
      'lte', // <=
      'gte', // >=
      'all'  // has every (tags:['action','adventure'])
    ];

    // Ensure `query` normalises aliased operators
    // No passing two different operators that mean the same thing.
    it('normalises aliases: not->neq and is->eq', function() {
      var q = query().where('stop').is(1).where('go').not(1);

      expect( q.qe.match[0].op ).to.equal( 'eq' );
      expect( q.qe.match[1].op ).to.equal( 'neq' );
    });

    it('fails if no .where(field) declared', function() {
      var err;
      try {
        var q = query().eq(1);
        expect(q).to.equal( undefined );
      }
      catch(e) { err = e; }
      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /requires.*where/ );
    });

    it('supports declared operators', function() {
      for (var i=0; i<operators.length; i++)
        expect( query()[operators[i]] ).to.be.ok;
    });

    it('sets operator and condition for all operators', function() {
      for (var i=0; i<operators.length; i++) {
        var q = query().where('foo');

        var cond = ( /in$|^all/.test( operators[i]) )
          ? [ operators[i] ]
          : operators[i];

        q[ operators[i] ]( cond );

        // Skip normalised aliases (where 'is'->'eq' etc)
        if (operators[i] !== 'is' && operators[i] !== 'not') {
          expect( q.qe.match[0].op ).to.equal( operators[i] );
          expect( q.qe.match[0].value ).to.equal( cond );
        }
      }
    });

    it('overwrites the last operator if multiple declared', function() {
      var q = query().where('id').eq('moo').neq('woof');
      expect( q.qe.match[0].op ).to.equal( 'neq' );
      expect( q.qe.match[0].value ).to.equal( 'woof' );
    });

    it('only accepts arrays for `in, nin, all`', function() {
      var q = query().where('tags');

      var ops = ['in', 'nin', 'all' ],
          i = ops.length;

      while ( i-- ) {
        var err;
        try {
          err = undefined;
          q[ ops[i] ]( 'action' );
        }
        catch( e ) { err = e; }
        expect( err ).to.be.an.instanceof( Error );
        expect( err.message ).to.match( /array/ );
      }
    });
  });

});
