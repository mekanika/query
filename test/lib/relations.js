var query = require('../../lib/index.js');
var expect = require('expect.js');

describe('Relations methods', function() {

  describe('.include(fields,opts,cb)', function() {

    it('should alias as .populate(fields...)', function() {
      var q = query().from('me').include('skills');
      expect( q.includes ).to.have.length( 1 );
    });

    it('should fail to include if no .from(resource) set', function(){
      var err;
      try {
        var q = query().include('demo');
        expect( q ).to.be( undefined );
      }
      catch( e ) { err = e; }

      expect( err ).to.be.an( Error );
      expect( err.message ).to.match( /include.*from/ );
    });

    it('should return and no-op if no relation passed', function() {
      var q = query().from('me').include();
      expect( q ).to.not.be.empty();
      expect( q.includes ).to.have.length( 0 );
    });

    it('should push a single relation onto the query if provided', function() {
      var q = query().from('me').include('skills');
      expect( q.includes ).to.have.length( 1 );
    });

    it('should push multiple if passed includes as array', function() {
      var q = query().from('me').include( ['skills', 'friends'] );
      expect( q.includes ).to.have.length( 2 );
    });

    it('should use correct includeObj structure', function() {
      var resourceDemo = 'magicman';
      var q = query().from( resourceDemo ).include( 'struct' );

      // Check `include` object structure
      expect( q.includes[0] ).to.have.keys( 'field', 'key' );
      // Check field stored as expected
      expect( q.includes[0].field ).to.be( 'struct' );
      // Check that 'key' defaults to '{resource}_id'
      expect( q.includes[0].key ).to.be( resourceDemo + '_id' );
    });

    it('should support an options argument to govern population');

    it('should support executing populate on a set of models');

  });

describe('.key(foreignKey)', function() {

  it('should fail if no include has been set', function() {
    var err;
    try {
      var q = query().from('me').key('whatever');
      expect( q ).to.be( undefined );
    }
    catch( e ) { err = e; }

    expect( err ).to.be.an( Error );
    expect( err.message ).to.match( /key.*include/ );
  });

  it('should update an include `key` property', function() {
    var q = query().from('me').include( 'name' ).key( 'smoo_id' );
    expect( q ).to.not.be.empty();
    expect( q.includes[0].key ).to.be( 'smoo_id' );
  });

  it('should update most recent of several includes', function() {
    var q = query().from('me').include( 'name' ).include('you').key('_id');
    expect( q.includes[1].key ).to.be( '_id' );
  });

});

});
