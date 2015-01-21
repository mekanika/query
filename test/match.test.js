var query = require('../lib/index.js');
var MatchContainer = require('../lib/match/MatchContainer');
var expect = require('chai').expect;


describe('Match', function() {

  it('exposes raw .match() to set .match', function () {
    var q = query().match('demo');
    expect( q.qe.match ).to.equal('demo');
  });

  it('.where( field ) initiates a default match container', function() {
    var q = query().where('whatever');
    expect( q.qe.match ).to.be.an.instanceof( MatchContainer );
  });

  it('.where() returns this query', function () {
    expect( query().where('!') ).to.be.an.instanceof( query.Query );
  });

  it('supports chaining .where() conditions', function() {
    var q = query().where('id').eq(100).where('name').eq('beep');
    expect( q.qe.match.and ).to.have.length( 2 );
  });

  it('alias and() for where()', function () {
    var q = query().and('one',1);
    expect( q.qe.match.and ).to.have.length(1);
  });

  it('.or() sets up an `or` match container', function () {
    var q = query().or('go',1);
    expect( q.qe.match.or ).to.have.length(1);
  });

  it('.or() modifies an existing match boolOp to OR', function () {
    var q = query().where('yo', 'momma').or('yo', 'poppa');
    expect( q.qe.match ).to.have.key( 'or' );
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

      expect( q.qe.match.and[0].stop ).to.have.key( 'eq' );
      expect( q.qe.match.and[1].go ).to.have.key( 'neq' );
    });

    it('fails if no .where(field) declared', function() {
      var err;
      try {
        var q = query().eq(1);
        expect(q).to.equal( undefined );
      }
      catch(e) { err = e; }
      expect( err ).to.be.an.instanceof( Error );
      expect( err.message ).to.match( /match/ );
    });

    it('supports declared operators', function() {
      for (var i=0; i<operators.length; i++)
        expect( query()[operators[i]] ).to.be.ok;
    });

    it('sets operator and condition for all operators', function() {
      for (var i=0; i<operators.length; i++) {
        var op = operators[i];
        var q = query().where('foo');

        var cond = ( /in$|^all/.test( op ) )
          ? [ op ]
          : op;

        q[op]( cond );

        // Skip normalised aliases (where 'is'->'eq' etc)
        if (op !== 'is' && op !== 'not') {
          expect( q.qe.match.and[0].foo ).to.have.key( op );
          expect( q.qe.match.and[0].foo[ op ] ).to.equal( cond );
        }
      }
    });

    it('overwrites the last operator if multiple declared', function() {
      var q = query().where('id').eq('moo').neq('woof');
      expect( q.qe.match.and[0].id ).to.have.key( 'neq' );
      expect( q.qe.match.and[0].id.neq ).to.equal( 'woof' );
    });

    it('only accepts arrays for `in, nin, all, any`', function() {
      var q = query().where('tags');

      var ops = ['in', 'nin', 'all', 'any'],
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
