var query = require('../lib/index.js');
var expect = require('expect.js');

describe('Relations methods', function() {

  describe('.include(fields,opts,cb)', function() {

    it('aliases as .populate(fields...)', function() {
      var q = query().from('me').include('skills');
      expect( q.includes ).to.have.length( 1 );
    });

    it('fails to include if no .from(resource) set', function(){
      var err;
      try {
        var q = query().include('demo');
        expect( q ).to.be( undefined );
      }
      catch( e ) { err = e; }

      expect( err ).to.be.an( Error );
      expect( err.message ).to.match( /include.*from/ );
    });

    it('returns and no-op if no relation passed', function() {
      var q = query().from('me').include();
      expect( q ).to.not.be.empty();
      expect( q.includes ).to.have.length( 0 );
    });

    it('pushes a single relation onto the query if provided', function() {
      var q = query().from('me').include('skills');
      expect( q.includes ).to.have.length( 1 );
    });

    it('pushes multiple if passed includes as array', function() {
      var q = query().from('me').include( ['skills', 'friends'] );
      expect( q.includes ).to.have.length( 2 );
    });

    it('uses correct includeObj structure', function() {
      var resourceDemo = 'magicman';
      var q = query().from( resourceDemo ).include( 'struct' );

      // Check `include` object structure
      expect( q.includes[0] ).to.have.keys( 'field', 'key' );
      // Check field stored as expected
      expect( q.includes[0].field ).to.be( 'struct' );
      // Check that 'key' defaults to '{resource}_id'
      expect( q.includes[0].key ).to.be( resourceDemo + '_id' );
    });

    it('supports an options argument to govern population');

    it('supports executing populate on a set of models');

  });

describe('.key(foreignKey)', function() {

  it('fails if no include has been set', function() {
    var err;
    try {
      var q = query().from('me').key('whatever');
      expect( q ).to.be( undefined );
    }
    catch( e ) { err = e; }

    expect( err ).to.be.an( Error );
    expect( err.message ).to.match( /key.*include/ );
  });

  it('updates an include `key` property', function() {
    var q = query().from('me').include( 'name' ).key( 'smoo_id' );
    expect( q ).to.not.be.empty();
    expect( q.includes[0].key ).to.be( 'smoo_id' );
  });

  it('updates most recent of several includes', function() {
    var q = query().from('me').include( 'name' ).include('you').key('_id');
    expect( q.includes[1].key ).to.be( '_id' );
  });

});

});
