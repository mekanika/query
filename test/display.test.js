/*eslint-env node, mocha */
var query = require('../lib/index.js');
var expect = require('chai').expect;

describe('Display methods', function () {
  it('sets .limit(num)', function () {
    var q = query().limit(10);
    expect(q.qe.limit).to.equal(10);
  });

  it('sets .offset(num)', function () {
    var q = query().offset(250);
    expect(q.qe.offset).to.equal(250);
  });

  it('supports offset via .page(num)', function () {
    // Page 1 should return record 1 (ie. offset 0)
    var q = query().limit(10).page(1);
    expect(q.qe.offset).to.equal(0);

    // Page 3 should return first result of 21 (if limit 10)
    // ie. Page 1 returns = 1-10
    //     Page 2 returns = 11-20
    //     Page 3 returns = 21-30 **(ie. offset 20)**
    q = query().limit(10).page(3);
    expect(q.qe.limit).to.equal(10);
    expect(q.qe.offset).to.equal(20);
  });

  it('fails to set page if limit not set first', function () {
    try {
      var q = query().page(1);
      expect(q).to.be.empty;
    } catch(e) {
      expect(q).to.equal(undefined);
    }
  });

});
