
var expect = require('chai').expect;
var MatchContainer = require('../lib/match/MatchContainer');

describe('MatchContainer', function () {

  var key = function (obj) {
    return Object.keys(obj)[0];
  };

  var mc;

  beforeEach(function() {
    mc = new MatchContainer();
  });

  it('constructor defaults op to `and`', function () {
    expect( key(mc) ).to.equal('and');
  });

  it('constructor can setup as `or`', function () {
    mc = new MatchContainer('or');
    expect( key(mc) ).to.equal('or');
  });

  it('.add(field) partial mo, default op `eq`', function () {
    mc.add('juice');
    expect( key(mc.and[0]) ).to.equal('juice');
    expect( mc.and[0].juice ).to.have.key( 'eq' );
  });

  it('.add(field,val) pushes {field:{eq:val}} mo', function () {
    mc.add('juice',99);
    expect( mc.and[0].juice.eq ).to.equal(99);
  });

  it('.add(field,val,op) pushes {field:{op:val}} mo', function () {
    mc.add('juice',99,'lte');
    expect( mc.and[0].juice.lte ).to.equal(99);
  });

  it('.where() chains new `mo`', function () {
    mc.where('ghosts', 'tread').where('go', 1);
    expect( mc.and ).to.have.length(2);
    expect( mc.and[1].go.eq ).to.equal( 1 );
  });

  it('match operators chain', function () {
    mc.where('chain').gt(1).where('next').neq('!');
    expect( mc.and[0].chain.gt ).to.equal(1);
    expect( mc.and[1].next.neq ).to.equal('!');
  });

  it('.or() changes boolOp to or', function () {
    mc.or('wow', 'such');
    expect( mc ).to.have.key('or');
    mc.where('doge').is('amaze');
    expect( mc.or ).to.have.length(2);
  });

});
