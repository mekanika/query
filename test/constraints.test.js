var query = require('../lib/index.js');
var expect = require('chai').expect;


describe('Constraints .where( field [,val] )', function() {

  it('pushes .where( field ) onto constraints array', function() {
    var q = query().where('whatever');
    expect( q.constraints ).to.have.length( 1 );
  });

  it('sets value when passed all .{where}(field,val)', function() {
    var q = query().where('id', 10).and('yes', 5).or('no', 3);
    expect( q.constraints[0].condition ).to.equal( 10 );
    expect( q.constraints[1].condition ).to.equal( 5 );
    expect( q.constraints[2].condition ).to.equal( 3 );
  });

  it('has constraint structure {field,operator,condition}', function(){
    var q = query().where('id');
    expect( q.constraints[0] )
      .to.have.keys( 'field', 'operator','condition', 'type' );
  });

  it('pushes default operator and condition for .where(field)', function(){
    var q = query().where('id');
    expect( q.constraints[0].operator ).to.equal( 'eq' );
    expect( q.constraints[0].condition ).to.equal( true );
  });

  it('supports creating multiple .where() conditions', function() {
    var q = query().where('id').eq(100).where('name').eq('beep');
    expect( q.constraints ).to.have.length( 2 );
  });

  it('enables .and(field) and .or(field) declarations', function() {
    var q = query().where('drink').and('your').or('milkshake');
    expect( q.constraints[0].type ).to.equal( 'and' );
    expect( q.constraints[1].type ).to.equal( 'and' );
    expect( q.constraints[2].type ).to.equal( 'or' );
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

  it('has a .contains() operator');
  it('has a .startsWith() operator');
  it('has a .endsWith() operator');

  describe('.{operator}( condition )', function() {

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
      var q = query().where('stop').is(1).and('go').not(1);

      expect( q.constraints[0].operator ).to.equal( 'eq' );
      expect( q.constraints[1].operator ).to.equal( 'neq' );
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
          expect( q.constraints[0].operator ).to.equal( operators[i] );
          expect( q.constraints[0].condition ).to.equal( cond );
        }
      }
    });

    it('overwrites the last operator if multiple declared', function() {
      var q = query().where('id').eq('moo').neq('woof');
      expect( q.constraints[0].operator ).to.equal( 'neq' );
      expect( q.constraints[0].condition ).to.equal( 'woof' );
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
