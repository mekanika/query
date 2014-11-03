/**
  Module dependencies
*/

    // The Query constructor class
var Query = require( './Query' ),

    // Query prototype methods
    core = require( './proto/core' ),
    actions = require( './proto/actions' ),
    middleware = require( './proto/middleware' ),
    constraints = require( './proto/match' ),
    modifiers = require('./proto/updates'),
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
  Internal reference to adapter instance

  Expects adapter#exec(): `_adapter( key ).exec( query, cb )`

  @private
*/

var _adapter;


/**
  Associate query instance with adapter `adapterKey`
  Note: reference to private `_adapter`

  @param {String} adapterKey
  @public
*/

proto.use = function( adapterKey ) {
  // Do we have an adapterClass to work with
  if (!_adapter)
    throw new Error('Query#use() requires query.adapterClass(class)');

  // Optimistically load in the adapter `adapterKey`
  if ( adapterKey ) this.adapter = _adapter( adapterKey );

  return this;
};


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
mixin( proto, modifiers );
mixin( proto, constraints );
mixin( proto, display );
mixin( proto, sort );


/**
  Main query interface. Exposes `new Query()` instances

  @public
*/

function query( adapterRef ) {
  var q = new Query();

  // Instantiate the query with an adapter
  typeof adapterRef === 'string'
    ? q.use( adapterRef )
    : q.useAdapter( adapterRef );

  return q;
}


/**
  Export Query constructor
*/

 query.Query = Query;


/**
  Set the adapter class for query to use
  ie. `_adapter( key )` where _adapter is our class set here

  Usually `query.adapterClass( require('mekanika-adapter') )`

  @param {Function} adapterClass
  @public
*/

query.adapterClass = function( adapterClass ) {
  _adapter = adapterClass;

  // Chaining: var query = require('query').adapterclass( adptr );
  return this;
};


/**
  Purge `query` class of all prior settings

  Note: Currently only resets the internal adapter class reference

  @public
*/

query.reset = function() {
  _adapter = undefined;
};
