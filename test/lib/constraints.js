var query = require('../../lib/index.js');
var expect = require('expect.js');


describe('Conditions', function() {

  it('should "dumb" push .where( constraint ) onto array', function() {
    var q = query().where('whatever');
    expect( q.constraints ).to.have.length( 1 );
  });

});
