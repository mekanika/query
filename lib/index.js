var Query = require('./Query');

// Query prototype methods
var core = require('./proto/core');
var actions = require('./proto/actions');
var constraints = require('./proto/constraints');
var paging = require('./proto/paging');
var sort = require('./proto/sort');


var proto = Query.prototype;

// Associate query instance with adapter `adapterKey`
// Note: reference to private `_adapter`
proto.use = function( adapterKey ) {
  // Do we have an adapterClass to work with
  if (!_adapter)
    throw new Error('Query#use() requires query.adapterClass(class)');

  // Optimistically load in the adapter `adapterKey`
  if ( adapterKey ) this.adapter = _adapter( adapterKey );

  return this;
};

var mixin = function( proto, main ) {
  for ( var method in main )
    if (main.hasOwnProperty(method)) proto[ method ] = main[ method ];
};

mixin( proto, core );
mixin( proto, actions );
mixin( proto, constraints );
mixin( proto, paging );
mixin( proto, sort );


// Adapter interface:
// adapterGetter( adapterKey ).exec( query, cb ) // - adapter#exec()
var _adapter;

// Main query interface. Exposes `new Query()` instances
var query = function( adapterKey ) {
  var q = new Query();

  // Instantiate the query with an adapter
  if (adapterKey) q.use( adapterKey );

  return q;
};

// Usually `query.adapterClass( require('adapter') )`
query.adapterClass = function( adapterClass ) {
  _adapter = adapterClass;

  // Support declaring: var query = require('query').adapterclass( adptr );
  return this;
};

// Purge `query` class of all prior settings
query.reset = function() {
  _adapter = undefined;
};

// Export query
module.exports = exports = query;
