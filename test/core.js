
var query = require('../lib/index.js');
var expect = require('expect.js');

describe('Tests', function(){


  it('should load library dependency', function(){
    expect( query ).to.be.ok();
  });

});
