/*eslint-env node, mocha */
var query = require('../lib/index.js');
var expect = require('chai').expect;

describe('Sorting methods', function () {
  it('sets up sort keys as an array', function () {
    var q = query().sort('name');
    expect(q.qe.sort).to.be.an.instanceof(Array);
    expect(q.qe.sort[0]).to.equal('name');
  });

  it('splits space separated keys into array', function () {
    var q = query().sort('name -age');
    expect(q.qe.sort).to.have.length(2);
    expect(q.qe.sort[1]).to.equal('-age');
  });

  it('chains .sort()', function () {
    expect(query().sort('!')).to.be.an.instanceof(query.Query);
  });

});
