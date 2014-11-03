/**
  Module dependencies
*/

    // The Query constructor class
var Query = require( './Query' ),

    // Query prototype methods
    core = require( './proto/core' ),
    actions = require( './proto/actions' ),
    middleware = require( './proto/middleware' ),
    match = require( './proto/match' ),
    updates = require('./proto/updates'),
    display = require( './proto/display' ),
    sort = require( './proto/sort' );


/**
  Expose the `query()` interface
*/

module.exports = query;


/**
  Shorthand reference to `Query.prototype`
*/

var proto = Query.prototype;


/**
  Internal method to mix in module `proto` methods into `main`

  @param {Query} proto The prototype of the Query class
  @param {Object} main The object with methods/props to mix into `proto`
  @ignore
*/

var mixin = function( proto, main ) {
  for ( var method in main )
    if (main.hasOwnProperty(method)) proto[ method ] = main[ method ];
};


/**
  Mix in the required methods into `Query.prototype`
*/

mixin( proto, core );
mixin( proto, actions );
mixin( proto, middleware );
mixin( proto, updates );
mixin( proto, match );
mixin( proto, display );
mixin( proto, sort );


/**
  Main query interface. Exposes `new Query()` instances

  @public
*/

function query( adapter ) {
  var q = new Query();

  // Instantiate the query with an adapter
  if (adapter) {
    if (!adapter.exec) throw new Error('Invalid adapter');
    q.useAdapter( adapter );
  }

  return q;
}


/**
  Export Query constructor
*/

 query.Query = Query;
