var query = require('../../lib/index.js');
var expect = require('expect.js');


describe('Constraints .where( field [,val] )', function() {

  it('should push .where( field ) onto constraints array', function() {
    var q = query().where('whatever');
    expect( q.constraints ).to.have.length( 1 );
  });

  it('should set value when passed all .{where}(field,val)', function() {
    var q = query().where('id', 10).and('yes', 5).or('no', 3);
    expect( q.constraints[0].condition ).to.be( 10 );
    expect( q.constraints[1].condition ).to.be( 5 );
    expect( q.constraints[2].condition ).to.be( 3 );
  });

  it('should have constraint structure {field,operator,condition}', function(){
    var q = query().where('id');
    expect( q.constraints[0] )
      .to.only.have.keys( 'field', 'operator','condition', 'type' );
  });

  it('should push default operator and condition for .where(field)', function(){
    var q = query().where('id');
    expect( q.constraints[0].operator ).to.be( 'eq' );
    expect( q.constraints[0].condition ).to.be( true );
  });

  it('should support creating multiple .where() conditions', function() {
    var q = query().where('id').eq(100).where('name').eq('beep');
    expect( q.constraints ).to.have.length( 2 );
  });

  it('should enable .and(field) and .or(field) declarations', function() {
    var q = query().where('drink').and('your').or('milkshake');
    expect( q.constraints[0].type ).to.be( 'and' );
    expect( q.constraints[1].type ).to.be( 'and' );
    expect( q.constraints[2].type ).to.be( 'or' );
  });

  it('should prevent setting constraints if ids were set', function() {
    var err, q;
    try {
      q = query().find(['1234', 4123]).where('smoo').is( true );
    }
    catch( e ) { err = e; }
    expect( err ).to.be.an( Error );
    expect( err.message ).to.match( /find.*id/ );
  });

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
    it('should normalise aliases: not->neq and is->eq', function() {
      var q = query().where('stop').is(1).and('go').not(1);

      expect( q.constraints[0].operator ).to.be( 'eq' );
      expect( q.constraints[1].operator ).to.be( 'neq' );
    });

    it('should fail if no .where(field) declared', function() {
      var err;
      try {
        var q = query().eq(1);
        expect(q).to.be( undefined );
      }
      catch(e) { err = e; }
      expect( err ).to.be.an( Error );
      expect( err.message ).to.match( /requires.*where/ );
    });

    it('should support declared operators', function() {
      for (var i=0; i<operators.length; i++)
        expect( query()[operators[i]] ).to.be.ok();
    });

    it('should set operator and condition for all operators', function() {
      for (var i=0; i<operators.length; i++) {
        var q = query().where('foo')[operators[i]]( operators[i] );

        // Skip normalised aliases (where 'is'->'eq' etc)
        if (operators[i] !== 'is' && operators[i] !== 'not') {
          expect( q.constraints[0].operator ).to.be( operators[i] );
          expect( q.constraints[0].condition ).to.be( operators[i] );
        }
      }
    });

    it('should overwrite the last operator if multiple declared', function() {
      var q = query().where('id').eq('moo').neq('woof');
      expect( q.constraints[0].operator ).to.be( 'neq' );
      expect( q.constraints[0].condition ).to.be( 'woof' );
    });
  });

});
