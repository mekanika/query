var query = require('../lib/index.js');
var expect = require('chai').expect;

describe('Populate', function() {

  it('fails to populate if no .on set', function(){
    var err;
    try {
      var q = query().populate('demo');
    }
    catch( e ) { err = e; }

    expect( err ).to.be.an.instanceof( Error );
    expect( err.message ).to.match( /populate.*on/ );
  });

  it('sets up a qe.populate field', function () {
    var q = query().on('me').populate('posts');
    expect( q.qe ).to.include.key( 'populate' );
  });

  it('adheres to {$field: {$key,$query}} structure', function () {
    var q = query().on('me').populate('posts', 'id', {});
    expect( q.qe.populate.posts ).to.have.keys( 'key', 'query');
  });

  it('supports passing ONLY a `field` (no key or qe)', function () {
    var q = query().on('me').populate('posts');
    expect( q.qe.populate.posts ).to.eql( {} );
  });

  it('supports passing a field and a key', function () {
    var q = query().on('me').populate('posts', 'id');
    expect( q.qe.populate.posts.key ).to.equal( 'id' );
  });

  it('supports passing a field and a qo', function () {
    var q = query().on('me').populate('posts', {on:'wat'});
    expect( q.qe.populate.posts.query ).to.eql( {on:'wat'} );
  });

  it('overwrites existing populate fields', function () {
    var q = query().on('me').populate('posts', 'come at me');
    expect( q.qe.populate.posts.key ).to.equal('come at me');
    q.populate('posts', 'bro');
    expect( q.qe.populate.posts.key ).to.equal('bro');
  });

  it('throws if subqo is not a clean "find" Qe', function (done) {
    try {
      query().on('me').populate('x', {updates:[]});
    }
    catch (e) {
      expect( e.message ).to.match( /invalid/i );
      try {
        query().on('me').populate('x', {body:[]});
      }
      catch (e) {
        expect( e.message ).to.match( /invalid/i );
        done();
      }
    }
  });



});
