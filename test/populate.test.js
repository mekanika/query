var query = require('../lib/index.js');
var expect = require('chai').expect;

describe('Populate', function() {

  it('fails to populate if no .resource set', function(){
    var err;
    try {
      var q = query().populate('demo');
    }
    catch( e ) { err = e; }

    expect( err ).to.be.an.instanceof( Error );
    expect( err.message ).to.match( /populate.*resource/ );
  });

  it('sets up a qo.populate field', function () {
    var q = query().from('me').populate('posts');
    expect( q.qo ).to.include.key( 'populate' );
  });

  it('uses a blank subquery `{}` if none provided', function () {
    var q = query().from('me').populate('posts');
    expect( q.qo.populate.posts ).to.eql( {} );
  });

  it('attaches subqo when passed', function () {
    var q = query().from('me').populate('posts', {resource:'whatever'});
    expect( q.qo.populate.posts.resource ).to.equal('whatever');
  });

  it('throws if subqo is not a clean "find" Qo', function (done) {
    // Woo nesting!
    try {
      query().from('me').populate('x', {action:'create'});
    }
    catch (e) {
      expect( e.message ).to.match( /invalid/i );
      try {
        query().from('me').populate('x', {updates:[]});
      }
      catch (e) {
        expect( e.message ).to.match( /invalid/i );
        try {
          query().from('me').populate('x', {body:[]});
        }
        catch (e) {
          expect( e.message ).to.match( /invalid/i );
          done();
        }
      }
    };
  });



});
