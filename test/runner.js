var query = require('../lib/index.js');
var expect = require('expect.js');


describe('Tests', function(){
  it('should load library dependency', function(){
    expect( query ).to.be.ok();
  });
});

describe('query()', function(){

  require('./lib/core.js');

  require('./lib/actions.js');
  require('./lib/criteria.js');
  require('./lib/sort.js');

});
