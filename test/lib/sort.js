var query = require('../../lib/index.js');
var expect = require('expect.js');

describe('Sorting methods', function() {

  beforeEach( function(){
    query.reset();
  });

  it('should set .asc( index )', function() {
    expect( query().asc().criteria.sort.direction ).to.be( 'asc' );
    expect( query().asc('smoo').criteria.sort.index ).to.be( 'smoo' );
  });

  it('should set .desc( index )', function() {
    expect( query().desc().criteria.sort.direction ).to.be( 'desc' );
    expect( query().desc('smoo').criteria.sort.index ).to.be( 'smoo' );
  });

  it('should set .order( index ) by', function() {
    expect( query().order('meep').criteria.sort.index ).to.be('meep');
  });

});
