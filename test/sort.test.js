var query = require('../lib/index.js');
var expect = require('chai').expect;

describe('Sorting methods', function() {

  it('sets up sort keys as an array', function () {
    var q = query().sort("name");
    expect( q.qo.sort ).to.be.an.instanceof( Array );
    expect( q.qo.sort[0] ).to.equal( 'name' );
  });

  it('splits space separated keys into array', function () {
    var q = query().sort("name -age");
    expect( q.qo.sort ).to.have.length( 2 );
    expect( q.qo.sort[1] ).to.equal( '-age' );
  });

  it('chains .sort()', function () {
    expect( query().sort('!') ).to.be.an.instanceof( query.Query );
  });

});
