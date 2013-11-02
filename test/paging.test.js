var query = require('../lib/index.js');
var expect = require('expect.js');

describe('Paging methods', function() {

  beforeEach( function(){
    query.reset();
  });

  it('should set .limit(num)', function() {
    var q = query().limit(10);
    expect( q.paging.limit ).to.be( 10 );
  });

  it('should set .offset(num)', function() {
    var q = query().offset(250);
    expect( q.paging.offset ).to.be( 250 );
  });

  it('should alias .offset() as .skip()', function() {
    var q = query().skip(150);
    expect( q.paging.offset ).to.be( 150 );
  });

  it('should support offset via .page(num)', function() {

    // Page 1 should return record 1 (ie. offset 0)
    var q = query().limit(10).page(1);
    expect( q.paging.offset ).to.be( 0 );

    // Page 3 should return first result of 21 (if limit 10)
    // ie. Page 1 returns = 1-10
    //     Page 2 returns = 11-20
    //     Page 3 returns = 21-30 **(ie. offset 20)**
    q = query().limit(10).page(3);
    expect( q.paging.limit ).to.be( 10 );
    expect( q.paging.offset ).to.be( 20 );
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