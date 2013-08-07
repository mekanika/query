var query = require('../../lib/index.js');
var expect = require('expect.js');


describe('Constraints .where( field )', function() {

  it('should push .where( field ) onto constraints array', function() {
    var q = query().where('whatever');
    expect( q.constraints ).to.have.length( 1 );
  });

  it('should have constraint structure {field,operator,condition}', function(){
    var q = query().where('id');
    expect( q.constraints[0] )
      .to.only.have.keys( 'field', 'operator','condition' );
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


  describe('.{operator}( condition )', function() {

    // Copied directly from source
    var operators = [
      'eq',  // ===
      'neq', // !==
      'in',  // has
      'nin', // !has
      'lt',  // <
      'gt',  // >
      'lte', // <=
      'gte'  // >=
    ];

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
        expect( q.constraints[0].operator ).to.be( operators[i] );
        expect( q.constraints[0].condition ).to.be( operators[i] );
      }
    });

    it('should overwrite the last operator if multiple declared', function() {
      var q = query().where('id').eq('moo').neq('woof');
      expect( q.constraints[0].operator ).to.be( 'neq' );
      expect( q.constraints[0].condition ).to.be( 'woof' );
    });
  });

});
