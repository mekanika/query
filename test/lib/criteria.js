var query = require('../../lib/index.js');
var expect = require('expect.js');

describe('Criteria methods', function() {

  beforeEach( function(){
    query.reset();
  });

  it('should set .limit(num)', function() {
    var q = query().limit(10);
    expect( q.criteria.limit ).to.be( 10 );
  });

  it('should set .offset(num)', function() {
    var q = query().offset(250);
    expect( q.criteria.offset ).to.be( 250 );
  });

  it('should support offset via .page(num)', function() {
    var q = query().limit(10).page(3);
    expect( q.criteria.limit ).to.be( 10 );
    // Offset should be `limit*page`
    // ie. Offset at zero should return record 1
    // offset at 30 should return record 31
    expect( q.criteria.offset ).to.be( 30 );
  });

  it('should fail to set page if limit not set first', function() {
    try {
      var q = query().page(1);
      expect( q ).to.be.empty();
    }
    catch(e) {
      expect( q ).to.be( undefined );
    }
  });

});
