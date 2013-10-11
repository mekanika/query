var query = require('../../lib/index.js');
var expect = require('expect.js');


describe('Modifiers', function() {

  it('should support modifiers as property on query#', function() {
    var q = query();
    expect( q.modifiers ).to.not.be( undefined );
  });

});
