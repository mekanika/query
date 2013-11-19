var query = require('../lib/index.js');
var expect = require('expect.js');

describe('Sorting methods', function() {

  beforeEach( function(){
    query.reset();
  });

  it('sets .asc( index )', function() {
    expect( query().asc().paging.sort[0].direction ).to.be( 'asc' );
    expect( query().asc('smoo').paging.sort[0].index ).to.be( 'smoo' );
  });

  it('sets .desc( index )', function() {
    expect( query().desc().paging.sort[0].direction ).to.be( 'desc' );
    expect( query().desc('smoo').paging.sort[0].index ).to.be( 'smoo' );
  });

  it('sets .order( index ) by', function() {
    expect( query().order('meep').paging.sort[0].index ).to.be('meep');
  });

  it('supports multiple support indeces');

});
